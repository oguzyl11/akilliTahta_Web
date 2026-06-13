# Dijital Eğitim Platformu 🚀

Modern, ölçeklenebilir ve çok kiracılı (multi-tenant) mimariye sahip yeni nesil eğitim yönetim platformu. Bu platform; interaktif PDF kitap okuyucusu, detaylı içerik editörü, rol bazlı kullanıcı yönetimi ve asenkron dosya işleme altyapısıyla eğitim kurumlarının dijital dönüşümünü sağlar.

## 🏗 Mimari Genel Bakış (Architecture)

Proje, **Monorepo** yaklaşımıyla tasarlanmış olup mikroservis destekli monolitik bir yapı kullanmaktadır. Temel bilesenler izole Docker konteynerlarında koşar ve **Nginx API Gateway** üzerinden dış dünyaya açılır.

- **Frontend (`/frontend`)**: Next.js (App Router), React Query, Zustand ve Tailwind CSS ile güçlendirilmiş, Glassmorphism tasarım diline sahip SPA/SSR mimarisi. İçerik editörü için `react-konva` (Canvas API) kullanılmıştır.
- **Core Backend (`/backend`)**: Laravel 11 tabanlı ana iş mantığı. PostgreSQL ile veri yönetimi, Sanctum ile JWT Auth ve Spatie ile RBAC (Rol & İzin) yönetimi.
- **PDF Processing Service (`/pdf-service`)**: FastAPI ve PyMuPDF destekli asenkron mikroservis. Devasa PDF'leri arkaplanda saniyeler içinde WebP sayfalarına dönüştürüp MinIO'ya aktarır ve Laravel'i Webhook ile bilgilendirir.
- **Infrastructure**: Storage olarak **MinIO** (S3 Uyumlu), caching ve queue yönetimi için **Redis**.

## 🛠 Teknoloji Yığını (Tech Stack)

| Katman | Teknolojiler |
| :--- | :--- |
| **Frontend** | Next.js 16.x, React 18, Tailwind CSS, Zustand, TanStack Query, Lucide Icons, React-Konva |
| **Backend** | PHP 8.3, Laravel 11.x, PostgreSQL 16, Redis 7 |
| **Microservice**| Python 3.11, FastAPI, Uvicorn, PyMuPDF, pdfplumber, Boto3 |
| **Altyapı** | Docker, Docker Compose, Nginx (Gateway), MinIO |

## 🚀 Kurulum (Installation)

Sistemi ayağa kaldırmak için bilgisayarınızda **Docker** ve **Docker Compose** kurulu olmalıdır. Bütün bağımlılıklar ve veritabanı kurulumları otomatik olarak Docker üzerinden gerçekleşir.

### 1. Repoyu Klonlayın
```bash
git clone https://github.com/oguzyl11/akilliTahta_Web.git
cd akilliTahta_Web
```

### 2. Çevresel Değişkenleri (Env) Ayarlayın
Proje ana dizininde bulunan `.env.example` veya servis klasörlerindeki örnekleri kullanabilirsiniz. Docker Compose otomatik olarak root dizindeki `.env` veya servislerin `.env` dosyalarını algılar.

### 3. Docker Compose ile Başlatın
Tüm sistemi arkaplanda ayağa kaldırmak için:
```bash
docker compose up -d
```

### 4. Kurulum Sonrası İşlemler (Sadece İlk Kurulumda)
Konteynerlar ayağa kalktıktan sonra, Laravel migration ve seed işlemlerini çalıştırarak veritabanını hazırlayın:
```bash
docker exec -it dep-backend php artisan migrate:fresh --seed
```
*Bu komut tabloları oluşturacak ve default Admin/Tenant hesaplarını yaratacaktır.*

## 🔌 Servisler ve Portlar

Docker ağı ayağa kalktığında servisler şu portlardan erişilebilir olur:

- **Frontend (Next.js):** `http://localhost:3000`
- **Backend API (Laravel):** `http://localhost:8000/api`
- **PDF Mikroservisi (FastAPI):** `http://localhost:8001/docs` (Swagger UI)
- **MinIO Console (S3):** `http://localhost:9001` (Default: `minioadmin` / `minioadmin`)
- **PostgreSQL:** `localhost:5432`
- **Redis:** `localhost:6379`

## 🧪 Demo Hesapları

Seed işlemi sonrasında aşağıdaki hesaplarla sisteme giriş yapabilirsiniz. **Ortak Şifre:** `12345678`

- **Sistem Yöneticisi:** `admin@akillitahta.com`
- **Kurum Yöneticisi:** `yonetici@demo.com`
- **Öğretmen:** `ogretmen@demo.com`
- **Öğrenci:** `ogrenci@demo.com`

## 📐 Mühendislik Standartları & Kurallar

Bu proje geliştirilirken katı mühendislik kurallarına uyulmaktadır. Tüm detaylar `ENGINEERING_STANDARDS.md` dosyasında yer almaktadır. Ana kurallar:

1. **SOLID ve DRY**: Kod tekrarından kaçınılmalı, sınıflar tek sorumluluğa (Single Responsibility) sahip olmalıdır.
2. **Fonksiyon Uzunlukları**: Hiçbir fonksiyon 20 satırı (okunabilirlik sınırı) ve parametre sayısı 3'ü geçmemelidir.
3. **Erken Dönüş (Early Return)**: İç içe (nested) `if-else` bloklarından kaçınılmalı, hata durumları hemen `return` veya `throw` ile döndürülmelidir (Guard Clauses).
4. **Çok Kiracılık (Multi-Tenancy)**: Tüm iş mantığı verileri, `tenant_id` kolonuna sahip olmalı ve `BelongsToTenant` trait'i (veya benzeri) ile korunmalıdır.

## 🤝 Katkıda Bulunma

1. İlgili issue için yeni bir feature branch oluşturun: `git checkout -b feature/amazing-feature`
2. Değişiklikleri yapın ve commit mesajlarını kurallara uygun yazın: `git commit -m "feat(ui): add new interactive canvas tools"`
3. Branch'i pushlayın: `git push origin feature/amazing-feature`
4. Pull Request açın.

---
*Dijital Eğitim Platformu — Geleceğin sınıfı için tasarlandı.*
