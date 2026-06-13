import os
import io
from typing import Dict, Any, Optional
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF
import pdfplumber
import boto3
import requests

# =============================================================================
# PDF Service — Dijital Eğitim Platformu
# Architecture: Receives Job JSON -> Download from MinIO -> Process -> Upload to MinIO -> Webhook
# =============================================================================

app = FastAPI(title="Dijital Eğitim Platformu - PDF Service", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Çevresel Değişkenler
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "http://minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minio_access_key")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minio_secret_key")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "dijital-egitim")

# Laravel Webhook URL (Docker network içinde nginx/php container'ına veya direkt backend container'ına gidecek)
# Nginx'e gitmesi standarttır
WEBHOOK_URL = os.getenv("WEBHOOK_URL", "http://nginx/api/v1/webhooks/pdf-processed")

def get_s3_client():
    # MinIO endpoint'in http:// ile başlaması gerekiyor
    endpoint_url = MINIO_ENDPOINT
    if not endpoint_url.startswith('http'):
        endpoint_url = f"http://{endpoint_url}"
        
    return boto3.client(
        's3',
        endpoint_url=endpoint_url,
        aws_access_key_id=MINIO_ACCESS_KEY,
        aws_secret_access_key=MINIO_SECRET_KEY,
        region_name='us-east-1',
    )

class ProcessJobRequest(BaseModel):
    book_id: int
    file_path: str  # MinIO içindeki yol (örn: books/1/orjinal.pdf)
    tenant_id: Optional[int] = None

class ProcessResponse(BaseModel):
    message: str
    job_id: str
    status: str

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pdf-pipeline"}

@app.post("/api/v1/pdf/process", response_model=ProcessResponse)
async def process_pdf_job(job: ProcessJobRequest, background_tasks: BackgroundTasks):
    """
    Laravel'den gelen "PDF'i İşle" isteğini alır.
    Sadece kuyruğa ekler ve hemen 202 döner.
    """
    job_id = f"book_{job.book_id}"
    
    background_tasks.add_task(process_pdf_pipeline, job.book_id, job.file_path, job.tenant_id)

    return ProcessResponse(
        message="PDF işleme sırasına alındı",
        job_id=job_id,
        status="processing"
    )

def process_pdf_pipeline(book_id: int, file_path: str, tenant_id: int = None):
    """
    1. Dosyayı MinIO'dan indir.
    2. PyMuPDF ile WebP olarak renderla ve MinIO'ya yükle.
    3. pdfplumber ile metinleri çek.
    4. Laravel'e webhook at.
    """
    s3_client = get_s3_client()
    local_pdf_path = f"/tmp/book_{book_id}.pdf"
    
    try:
        print(f"[{book_id}] MinIO'dan dosya indiriliyor: {file_path}")
        s3_client.download_file(MINIO_BUCKET, file_path, local_pdf_path)
        
        # 1. PyMuPDF (Render to WebP)
        print(f"[{book_id}] PyMuPDF ile render işlemi başlıyor...")
        doc = fitz.open(local_pdf_path)
        total_pages = len(doc)
        
        pages_metadata = []
        
        for page_num in range(total_pages):
            page = doc.load_page(page_num)
            
            # DPI = 150 (Matrix 2x = 144 DPI civarı)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            
            # Bellekte WebP formatına çevir (Pillow kullanmaya gerek yok, fitz destekler)
            # fitz'de doğrudan webp kaydetmek için uzantıyı kullanır, byte olarak almak için tobbytes:
            image_bytes = pix.tobytes("webp")
            
            # MinIO'ya yükle (public klasörüne atalım ki dışarıdan erişilebilsin)
            s3_page_key = f"public/books/{book_id}/pages/page_{page_num + 1}.webp"
            
            s3_client.put_object(
                Bucket=MINIO_BUCKET,
                Key=s3_page_key,
                Body=image_bytes,
                ContentType="image/webp",
                # WebP olduğu için tarayıcıda doğrudan açılabilir
            )
            
            pages_metadata.append({
                "page_number": page_num + 1,
                "image_url": s3_page_key,
                "text_content": ""
            })
            print(f"[{book_id}] Sayfa {page_num + 1}/{total_pages} render edildi ve yüklendi.")

        # 2. pdfplumber (Metin Çıkarımı)
        print(f"[{book_id}] Metin analizine geçiliyor...")
        with pdfplumber.open(local_pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    pages_metadata[page_num]["text_content"] = text

        print(f"[{book_id}] İşlem tamam. Webhook gönderiliyor...")
        
        # 3. Webhook (Laravel'e Bildir)
        payload = {
            "book_id": book_id,
            "status": "COMPLETED",
            "total_pages": total_pages,
            "pages": pages_metadata
        }
        
        response = requests.post(WEBHOOK_URL, json=payload, timeout=10)
        print(f"[{book_id}] Webhook Yanıtı: {response.status_code}")

    except Exception as e:
        print(f"[{book_id}] Hata oluştu: {str(e)}")
        # Hata durumunu Laravel'e bildir
        error_payload = {
            "book_id": book_id,
            "status": "FAILED",
            "error_message": str(e)
        }
        try:
            requests.post(WEBHOOK_URL, json=error_payload, timeout=10)
        except Exception as we:
            print(f"[{book_id}] Hata Webhook'u gönderilemedi: {str(we)}")
            
    finally:
        # Geçici dosyayı temizle
        if os.path.exists(local_pdf_path):
            os.remove(local_pdf_path)
