import os
import shutil
from typing import Dict, Any
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF
import pdfplumber

# =============================================================================
# PDF Service — Dijital Eğitim Platformu
# ENGINEERING_STANDARDS: PyMuPDF for rendering, pdfplumber for metadata
# =============================================================================

app = FastAPI(title="Dijital Eğitim Platformu - PDF Service", version="1.0.0")

# CORS yapılandırması
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Üretimde sınırlandırılmalı
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/tmp/pdf_uploads"
OUTPUT_DIR = "/tmp/pdf_outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

class ProcessResponse(BaseModel):
    message: str
    job_id: str
    status: str

@app.get("/health")
async def health_check():
    """Servis sağlık durumu."""
    return {"status": "healthy", "service": "pdf-pipeline"}

@app.post("/api/v1/pdf/process", response_model=ProcessResponse)
async def process_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    PDF dosyasını alır ve arka planda işleme sokar.
    Laravel'den gelen asenkron istekleri karşılar.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Sadece PDF dosyaları kabul edilir.")

    # Benzersiz job_id (Basitçe dosya adı ve timestamp, üretimde uuid kullanılabilir)
    import uuid
    job_id = str(uuid.uuid4())
    
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    
    # Dosyayı kaydet
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Arka planda işle
    background_tasks.add_task(extract_pdf_data, job_id, file_path)

    return ProcessResponse(
        message="PDF işleme sırasına alındı",
        job_id=job_id,
        status="processing"
    )

def extract_pdf_data(job_id: str, file_path: str):
    """
    PDF dosyasını analiz eder.
    1. PyMuPDF (fitz) ile sayfaları SVG/PNG olarak dışa aktarır.
    2. pdfplumber ile metin ve soru-cevap şablonlarını analiz eder.
    """
    try:
        # 1. PyMuPDF ile Sayfa Render (Görsel İşleme)
        doc = fitz.open(file_path)
        total_pages = len(doc)
        
        job_output_dir = os.path.join(OUTPUT_DIR, job_id)
        os.makedirs(job_output_dir, exist_ok=True)

        metadata = {
            "total_pages": total_pages,
            "pages": []
        }

        # Sayfaları dön ve görselleri çıkar
        for page_num in range(total_pages):
            page = doc.load_page(page_num)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x scale for better resolution
            image_path = os.path.join(job_output_dir, f"page_{page_num + 1}.png")
            pix.save(image_path)
            
            metadata["pages"].append({
                "page": page_num + 1,
                "image_path": image_path,
                "text_content": ""
            })

        # 2. pdfplumber ile Metin ve Koordinat Analizi
        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                metadata["pages"][page_num]["text_content"] = text

        # TODO: Laravel'e webhook ile sonuçları dön
        # requests.post("http://nginx/api/v1/webhooks/pdf-processed", json={"job_id": job_id, "metadata": metadata})

    except Exception as e:
        print(f"Error processing PDF {job_id}: {str(e)}")
        # TODO: Laravel'e hata durumu bildir
    finally:
        # Geçici dosyayı temizle
        if os.path.exists(file_path):
            os.remove(file_path)
