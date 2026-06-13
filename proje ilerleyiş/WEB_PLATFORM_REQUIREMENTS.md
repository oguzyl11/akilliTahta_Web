# Web Platformu — İster Dokümanı & Mimari Rehberi

> Dijital Eğitim Platformu — Web Uygulaması  
> Kaynak: `Dijital_Egitim_Platformu_Modul_Listesi.xlsx` (864 saat, 18 kategori)  
> Sürüm: 1.0 | Haziran 2025

---

## İçindekiler

1. [Platforma Genel Bakış](#1-platforma-genel-bakış)
2. [Teknoloji Stack](#2-teknoloji-stack)
3. [Repo Yapısı & Kurulum](#3-repo-yapısı--kurulum)
4. [Mimari & Klasör Yapısı](#4-mimari--klasör-yapısı)
5. [Modül İsterleri](#5-modül-isterleri)
6. [Veritabanı Şeması](#6-veritabanı-şeması)
7. [Multi-Tenant Yapısı](#7-multi-tenant-yapısı)
8. [PDF Pipeline](#8-pdf-pipeline)
9. [Auth & RBAC](#9-auth--rbac)
10. [API Sözleşmesi](#10-api-sözleşmesi)
11. [Environment Değişkenleri](#11-environment-değişkenleri)
12. [CI/CD & Deployment](#12-cicd--deployment)
13. [Sprint Planı](#13-sprint-planı)

---

## 1. Platforma Genel Bakış

Dijital Eğitim Platformu, okul kurumlarının PDF kitaplarını interaktif içeriğe dönüştürmesine; öğretmenlerin ödev oluşturmasına; öğrencilerin kitap okumasına ve test çözmesine; velilerin çocuklarını takip etmesine imkân tanıyan **çok kiracılı (multi-tenant) bir web eğitim yönetim sistemidir**.

### Kullanıcı Rolleri

| Rol | Kısaltma | Erişim Kapsamı |
|-----|----------|----------------|
| Öğrenci | `STUDENT` | Kendi kitapları, ödevleri, sonuçları |
| Öğretmen | `TEACHER` | Sınıf öğrencileri, ödev oluşturma, raporlar |
| Veli | `PARENT` | Bağlı çocukların verileri |
| Kurum Yöneticisi | `INSTITUTION_ADMIN` | Kendi kurumunun tüm verisi |
| Süper Admin | `SUPER_ADMIN` | Tüm kurumlar, sistem yönetimi |

### Kapsam Dışı (Bu Faz)

- Native mobil uygulama (iOS / Android)
- Harici LMS entegrasyonu (Moodle vb.)
- SMS bildirimleri
- OCR tabanlı taranmış PDF desteği

---

## 2. Teknoloji Stack

### Backend

```
PHP 8.3 + Laravel 11
├── Sanctum           → API token auth
├── Spatie Permission → RBAC (rol & izin)
├── Laravel Queue     → Async işler (PDF, e-posta)
├── Laravel Scout     → İçerik arama
└── Telescope         → Debug (sadece dev/staging)

Veritabanı
├── PostgreSQL 16     → Ana veritabanı
├── Redis 7           → Cache + Queue + Session
└── MinIO / AWS S3    → Dosya depolama (PDF, WebP, video)

Python Microservice (PDF Pipeline)
├── FastAPI           → HTTP endpoint
├── PyMuPDF (fitz)    → PDF → WebP render
└── pdfplumber        → Koordinat çıkarma
```

### Frontend

```
Next.js 14 (App Router) + TypeScript
├── Tailwind CSS      → Stil
├── Zustand           → State management
├── TanStack Query    → Server state / cache
├── Konva.js          → PDF üzeri etkileşim editörü
├── pdf.js            → Tarayıcı PDF render (fallback)
└── Chart.js          → Analitik grafikler
```

### DevOps

```
Docker + Docker Compose   → Tüm ortamlar
Nginx                     → Reverse proxy + SSL
GitHub Actions            → CI/CD
Sentry                    → Hata takibi
```

---

## 3. Repo Yapısı & Kurulum

### Repolar

```
github.com/[org]/dijital-egitim-web        ← Bu repo (Next.js frontend)
github.com/[org]/dijital-egitim-api        ← Laravel backend
github.com/[org]/dijital-egitim-pdf        ← Python PDF pipeline
github.com/[org]/dijital-egitim-electron   ← Akıllı tahta (Electron)
```

### Hızlı Kurulum (Web Repo)

```bash
# 1. Repoyu klonla
git clone git@github.com:[org]/dijital-egitim-web.git
cd dijital-egitim-web

# 2. Bağımlılıkları kur
npm install

# 3. Ortam dosyasını oluştur
cp .env.example .env.local

# 4. Geliştirme sunucusunu başlat
npm run dev
# → http://localhost:3000

# 5. Testleri çalıştır
npm run test
npm run test:e2e
```

### Docker ile Tüm Stack

```bash
# Tüm servisleri tek komutla ayağa kaldır
docker compose up -d

# Servisler:
# http://localhost:3000  → Frontend (Next.js)
# http://localhost:8000  → API (Laravel)
# http://localhost:8001  → PDF Service (FastAPI)
# http://localhost:5432  → PostgreSQL
# http://localhost:6379  → Redis
# http://localhost:9000  → MinIO Console
```

---

## 4. Mimari & Klasör Yapısı

### Backend Klasör Yapısı (Laravel)

```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── Auth/
│   │   │   ├── LoginController.php
│   │   │   ├── RegisterController.php
│   │   │   └── PasswordResetController.php
│   │   ├── Student/
│   │   │   ├── DashboardController.php
│   │   │   ├── AssignmentController.php
│   │   │   └── BookController.php
│   │   ├── Teacher/
│   │   │   ├── ClassroomController.php
│   │   │   ├── AssignmentController.php
│   │   │   └── ReportController.php
│   │   ├── Parent/
│   │   │   ├── ChildController.php
│   │   │   └── NotificationController.php
│   │   ├── Institution/
│   │   │   ├── DashboardController.php
│   │   │   ├── UserController.php
│   │   │   └── ReportController.php
│   │   └── SuperAdmin/
│   │       ├── TenantController.php
│   │       └── BookController.php
│   ├── Requests/
│   ├── Resources/
│   └── Middleware/
│       ├── EnsureTenantScope.php     ← Multi-tenant global filtre
│       └── CheckPermission.php
├── Services/
│   ├── Assignment/
│   │   ├── AssignmentService.php
│   │   └── SubmissionService.php
│   ├── Book/
│   │   ├── BookService.php
│   │   └── PageInteractionService.php
│   ├── Notification/
│   │   ├── NotificationService.php
│   │   └── Channels/
│   │       ├── EmailChannel.php
│   │       └── InAppChannel.php
│   ├── Pdf/
│   │   └── PdfPipelineService.php    ← Python service ile haberleşir
│   └── Report/
│       ├── StudentReportService.php
│       └── InstitutionReportService.php
├── Repositories/
│   ├── Contracts/
│   │   ├── AssignmentRepositoryInterface.php
│   │   └── StudentRepositoryInterface.php
│   └── Eloquent/
│       ├── AssignmentRepository.php
│       └── StudentRepository.php
├── Models/
│   ├── Tenant.php
│   ├── User.php
│   ├── Student.php
│   ├── Teacher.php
│   ├── Parent.php
│   ├── Classroom.php
│   ├── Book.php
│   ├── BookPage.php
│   ├── Hotspot.php
│   ├── Assignment.php
│   ├── AssignmentSubmission.php
│   ├── Question.php
│   └── ActivityLog.php
├── Jobs/
│   ├── ProcessPdfBook.php
│   ├── GenerateStudentReport.php
│   └── SendParentNotification.php
└── Policies/
    ├── AssignmentPolicy.php
    ├── BookPolicy.php
    └── StudentPolicy.php
```

### Frontend Klasör Yapısı (Next.js)

```
src/
├── app/                              ← App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (student)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── books/[bookId]/page.tsx
│   │   └── assignments/page.tsx
│   ├── (teacher)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── assignments/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/results/page.tsx
│   │   └── classrooms/[id]/page.tsx
│   ├── (parent)/
│   │   └── ...
│   ├── (institution)/
│   │   └── ...
│   └── (admin)/
│       └── ...
├── components/
│   ├── ui/                           ← Atomic bileşenler
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   ├── common/                       ← Paylaşılan layout bileşenleri
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Breadcrumb.tsx
│   └── features/
│       ├── pdf-viewer/
│       │   ├── PdfViewer.tsx         ← Ana görüntüleyici
│       │   ├── PageCanvas.tsx        ← WebP + hotspot katmanı
│       │   ├── HotspotLayer.tsx      ← Tıklanabilir bölgeler
│       │   └── FullscreenMode.tsx    ← Akıllı tahta modu
│       ├── question/
│       │   ├── QuestionRenderer.tsx
│       │   ├── AnswerInput.tsx
│       │   └── ResultScreen.tsx
│       ├── assignment/
│       │   ├── AssignmentCard.tsx
│       │   ├── AssignmentWizard.tsx
│       │   └── SubmissionList.tsx
│       └── analytics/
│           ├── SuccessRateChart.tsx
│           └── ActivityTimeline.tsx
├── services/                         ← API çağrı katmanı
│   ├── api.ts                        ← Axios instance + interceptor
│   ├── authService.ts
│   ├── bookService.ts
│   ├── assignmentService.ts
│   └── reportService.ts
├── stores/
│   ├── authStore.ts
│   └── pdfViewerStore.ts
├── hooks/
│   ├── useAuth.ts
│   ├── usePdfViewer.ts
│   └── useDebounce.ts
└── types/
    ├── auth.ts
    ├── book.ts
    ├── assignment.ts
    └── report.ts
```

---

## 5. Modül İsterleri

### MOD-01 | Proje Başlangıcı & Planlama
**Efor: 68 saat | Öncelik: Yüksek**

- [ ] Paydaş görüşmeleri tamamlanır, kullanıcı hikayeleri Jira'ya işlenir
- [ ] Mimari karar kayıtları (ADR) dokümante edilir
- [ ] ERD diyagramı onaylanır
- [ ] Tüm roller için wireframe onaylanır
- [ ] `dev`, `staging`, `production` ortamları Docker ile ayağa kaldırılır

---

### MOD-02 | Auth & Multi-Tenant Altyapı
**Efor: 56 saat | Öncelik: Yüksek**

**İsterleri:**

- Sisteme 5 farklı rolle giriş yapılabilmelidir: `STUDENT`, `TEACHER`, `PARENT`, `INSTITUTION_ADMIN`, `SUPER_ADMIN`
- Her kurumun kendine özel subdomain'i bulunur: `okuladi.platform.com`
- Subdomain login sayfasında kuruma özel logo ve renk gösterilir
- Şifre sıfırlama e-posta ile yapılır; token 60 dakika geçerlidir
- E-posta doğrulaması kayıt sonrası zorunludur
- `INSTITUTION_ADMIN` kendi kurumunun dışındaki hiçbir veriye erişemez
- Tüm sorgular `tenant_id` ile otomatik filtrelenir (global scope)
- Eş zamanlı aktif oturum sınırlandırılabilir (kuruma özel)

**Teknik Notlar:**
```php
// Global scope — tüm Model sorgularına otomatik eklenir
class TenantScope implements Scope {
    public function apply(Builder $builder, Model $model): void {
        $builder->where('tenant_id', auth()->user()?->tenant_id);
    }
}
```

---

### MOD-03 | Kurum & Kullanıcı Yönetimi
**Efor: 44 saat | Öncelik: Yüksek**

**İsterleri:**

- `SUPER_ADMIN` kurum ekler, düzenler, lisans tipi ve kullanıcı limiti belirler
- `INSTITUTION_ADMIN` kendi kurumu altında sınıf ve şube oluşturur
- Öğrenci ve veli bilgileri Excel/CSV ile toplu yüklenebilir
- Bir veli birden fazla çocuğuyla eşleştirilebilir (davet sistemi ile)
- Kullanıcılar profil fotoğrafı, iletişim bilgisi ve bildirim tercihlerini düzenler

**Toplu Yükleme Excel Formatı:**

| ad | soyad | tc_kimlik | sinif | veli_telefon |
|----|-------|-----------|-------|--------------|
| Ali | Yılmaz | 12345678901 | 8-A | 0555... |

---

### MOD-04 | PDF Yükleme & İçerik Yönetimi
**Efor: 38 saat | Öncelik: Yüksek**

**İsterleri:**

- `SUPER_ADMIN` ve `INSTITUTION_ADMIN` drag-drop ile PDF yükler
- Yükleme sırasında kitap adı, sınıf seviyesi, ders, kapak görseli girilir
- PDF maksimum 200 MB olabilir; tip doğrulaması sunucu tarafında yapılır
- Kitaba kategori ve etiket atanabilir
- Kitap bir veya birden fazla kuruma / sınıfa atanabilir; geçerlilik tarihi belirlenir
- Kitapların sürüm geçmişi tutulur

---

### MOD-05 | PDF → İnteraktif Dönüşüm Pipeline
**Efor: 70 saat | Öncelik: Yüksek**

Bu modül platformun teknik kalbidir.

**İster Akışı:**

```
1. PDF yüklenir → S3/MinIO'ya kaydedilir
2. Laravel Job kuyruğa atılır
3. Python FastAPI servisi her sayfayı 150dpi WebP'ye render eder
4. pdfplumber metin parçalarını x,y,w,h koordinatlarıyla çıkarır
5. Çıktılar (WebP + JSON koordinat) S3'a yazılır
6. book_pages tablosu güncellenir
7. Frontend WebSocket/SSE ile ilerleme bildirimini alır
```

**FastAPI Endpoint:**

```python
# POST /render
# Body: { "pdf_url": "...", "book_id": 42, "dpi": 150 }
# Response: { "status": "queued", "job_id": "..." }

@app.post("/render")
async def render_pdf(request: RenderRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_pdf, request)
    return {"status": "queued", "job_id": str(uuid4())}
```

**Desteklenen PDF Türleri:**

| Tür | Destek | Not |
|-----|--------|-----|
| Metin tabanlı | ✅ Tam | Koordinat çıkarma dahil |
| Görsel ağırlıklı | ✅ Render | Koordinat yok |
| Korumalı (şifreli) | ❌ | Kapsam dışı |
| Taranmış (OCR) | ❌ | Faz 2 |

---

### MOD-06 | İçerik Etkileşim Editörü
**Efor: 68 saat | Öncelik: Yüksek**

**İsterleri:**

- `INSTITUTION_ADMIN` PDF sayfaları üzerine hotspot (tıklanabilir bölge) çizer
- Hotspot türleri: Video bağlantısı, Soru, Popup mesaj, Sayfa atlama
- YouTube, Vimeo ve yerel video embed edilebilir
- Soru türleri: Çoktan seçmeli, Doğru-Yanlış, Boşluk doldurma, Eşleştirme
- Her soruya doğru cevap, açıklama ve puan atanır
- Editör kaydedilmeden önce önizleme yapılabilir

**Hotspot Veri Yapısı:**

```typescript
interface Hotspot {
  id: number;
  pageId: number;
  type: 'video' | 'question' | 'popup' | 'link';
  coordinates: { x: number; y: number; width: number; height: number };
  payload: VideoPayload | QuestionPayload | PopupPayload | LinkPayload;
}
```

---

### MOD-07 | Öğrenci Paneli
**Efor: 56 saat | Öncelik: Yüksek**

**İsterleri:**

- Ana sayfa: Atanmış kitaplar, son okunan sayfa, aktif ödevler
- Kitap okuyucu: Sayfa gezinme, hotspot etkileşim, video oynatıcı, zoom
- Test çözme: Soru gösterimi, cevap kaydetme, anlık geri bildirim, sonuç ekranı
- Ödev listesi: Durum göstergesi (yapılmadı / tamamlandı / süresi geçti)
- İlerleme: Kendi sayfa okuma ve test istatistiklerini görme

---

### MOD-08 | Öğretmen Paneli
**Efor: 66 saat | Öncelik: Yüksek**

**İsterleri:**

- Sorumlu olduğu sınıflar ve öğrenci listesi
- Ödev oluşturma sihirbazı: Kitap bölümü seç → Video/soru ata → Son tarih belirle → Sınıfa yayınla
- Ödev takibi: Kim teslim etti, kim teslim etmedi; otomatik puanlama
- Analiz ekranı: Sınıf bazlı, öğrenci bazlı, soru bazlı doğru/yanlış istatistiği
- Aktivite geçmişi: Zaman damgalı log (kim, ne zaman, ne yaptı)
- Velilere bireysel veya toplu mesaj gönderme

---

### MOD-09 | Veli Paneli
**Efor: 36 saat | Öncelik: Yüksek**

**İsterleri:**

- Veli yalnızca kendi bağlı çocuklarının verilerini görür
- Çocuğun test sonuçları ve ödev durumu görüntülenir
- Öğretmenden gelen bildirim ve raporlar listelenir
- Kurum tarafından yüklenen veli akademisi videoları izlenebilir

---

### MOD-10 | Kurum / Yönetim Paneli
**Efor: 50 saat | Öncelik: Yüksek**

**İsterleri:**

- Dashboard KPI: Aktif kullanıcı sayısı, ödev tamamlama oranı, sınıf başarı ortalaması
- Sınıflar arası başarı kıyaslama ve trend grafikleri
- Bireysel öğrenci kartı: Gelişim çizelgesi, tüm test geçmişi
- Ders / sınıf / dönem bazlı filtreli raporlar
- Raporlar PDF veya Excel olarak indirilebilir

---

### MOD-11 | Aktivite Log & Analitik
**Efor: 36 saat | Öncelik: Yüksek**

**Loglanacak Olaylar:**

| Olay Adı | Tetiklenme |
|----------|-----------|
| `book.page.viewed` | Öğrenci sayfa açtığında |
| `video.started` | Video oynatmaya başlandığında |
| `video.completed` | Video %90+ izlendiğinde |
| `question.answered` | Soru cevaplandığında |
| `assignment.started` | Ödeve başlandığında |
| `assignment.submitted` | Ödev teslim edildiğinde |
| `test.completed` | Test bitirildiğinde |

---

### MOD-12 | Bildirim & İletişim
**Efor: 24 saat | Öncelik: Yüksek**

**İsterleri:**

- Gerçek zamanlı in-app bildirimler (WebSocket / Pusher / Soketi.io)
- E-posta bildirimleri: Ödev atama, test sonucu, rapor gönderimi
- Veli bildirim akışı: Otomatik tetikleyiciler (ödev süresi dolmadan 1 gün önce, test sonucu vb.)
- Bildirim tercihleri kullanıcı tarafından yönetilir

---

### MOD-13 | Güvenlik & KVKK
**Efor: 34 saat | Öncelik: Yüksek**

**İsterleri:**

- Tüm iletişim HTTPS üzerinden; secure cookie, HSTS header
- Hassas alanlar (TC kimlik vb.) DB seviyesinde şifrelenir
- KVKK aydınlatma metni kayıt akışında gösterilir; açık rıza kaydedilir
- Kişisel veri silme talebi işlenebilir (kullanıcı hesabı anonimleştirme)
- Kritik işlemler (kitap silme, kullanıcı engelleme) audit log'a yazılır
- Brute force koruması: 5 başarısız girişten sonra geçici kilitleme
- Login endpoint'e rate limiting uygulanır

---

### MOD-14 | Responsive & Cihaz Uyumluluğu
**Efor: 30 saat | Öncelik: Yüksek**

**İsterleri:**

- Masaüstü (1280px+), tablet (768-1279px), mobil (< 768px) kırılım noktaları
- Tarayıcı desteği: Chrome 110+, Firefox 110+, Edge 110+, Safari 16+
- Touch gesture desteği: Kaydırma, pinch-to-zoom
- Akıllı tahta modu: Tam ekran, büyük tıklama alanları (min 44×44px), kalem desteği
- PDF görüntüleyici dokunmatik ekranda da kullanışlı olmalıdır

---

### MOD-15 | Test & Kalite Güvence
**Efor: 80 saat | Öncelik: Yüksek**

**Backend Testler:**
```bash
php artisan test --coverage
# Hedef: Service katmanı %80+
```

**Frontend Testler:**
```bash
npm run test          # Jest + React Testing Library
npm run test:e2e      # Playwright
```

**Zorunlu E2E Senaryoları:**

1. Öğretmen ödev oluşturur → Öğrenci görür ve çözer → Veli bildirimi alır
2. Admin PDF yükler → Pipeline tamamlanır → Öğrenciye atanır → Kitap açılır
3. Öğrenci test çözer → Sonuç kaydedilir → Öğretmen raporda görür
4. Veli çocuğun performansını görüntüler
5. Admin toplu kullanıcı yükler → Hesaplar açılır

---

### MOD-16 | Deployment & DevOps
**Efor: 26 saat | Öncelik: Yüksek**

**İsterleri:**

- Nginx reverse proxy; subdomain wildcard: `*.platform.com`
- SSL: Let's Encrypt veya kurumsal wildcard sertifika
- PostgreSQL otomatik günlük yedekleme (en az 30 gün saklama)
- Sentry ile hata takibi; uptime monitoring
- GitHub Actions CI: test → lint → build → deploy

---

## 6. Veritabanı Şeması

### Temel Tablolar

```sql
-- Kiracılar (Okullar)
tenants
  id, name, subdomain, logo_url, primary_color,
  license_type, user_limit, is_active,
  created_at, updated_at, deleted_at

-- Kullanıcılar
users
  id, tenant_id, name, email, password,
  role (STUDENT|TEACHER|PARENT|INSTITUTION_ADMIN|SUPER_ADMIN),
  email_verified_at, avatar_url,
  created_at, updated_at, deleted_at

-- Öğrenci profili
students
  id, user_id, tenant_id, classroom_id,
  student_number, tc_identity_encrypted,
  created_at, updated_at

-- Veli-Öğrenci ilişkisi (çoktan çoğa)
parent_student
  parent_id, student_id, relation_type

-- Sınıflar
classrooms
  id, tenant_id, name, grade_level, branch,
  teacher_id, academic_year,
  created_at, updated_at

-- Kitaplar
books
  id, tenant_id, title, subject, grade_level,
  cover_url, pdf_url, pdf_size_bytes, version,
  render_status (pending|processing|completed|failed),
  page_count, created_by, created_at, updated_at

-- Sayfalar
book_pages
  id, book_id, page_number,
  image_url, image_width, image_height,
  text_coords (jsonb), created_at

-- Hotspot'lar
hotspots
  id, book_page_id, type (video|question|popup|link),
  x, y, width, height,
  payload (jsonb), order, created_at

-- Sorular
questions
  id, hotspot_id, type (multiple_choice|true_false|fill_blank|match),
  body, options (jsonb), correct_answer (jsonb),
  explanation, points, created_at

-- Ödevler
assignments
  id, tenant_id, classroom_id, teacher_id, book_id,
  title, description, due_date,
  status (draft|active|closed),
  created_at, updated_at, deleted_at

-- Ödev teslim
assignment_submissions
  id, assignment_id, student_id,
  status (not_started|in_progress|submitted),
  score, max_score, submitted_at, created_at

-- Cevaplar
question_answers
  id, submission_id, question_id, student_id,
  given_answer (jsonb), is_correct, time_spent_seconds, created_at

-- Aktivite logları
activity_logs
  id, tenant_id, user_id, event_name,
  loggable_type, loggable_id, meta (jsonb),
  created_at

-- Bildirimler
notifications
  id, tenant_id, user_id, type,
  title, body, data (jsonb),
  read_at, created_at
```

---

## 7. Multi-Tenant Yapısı

Platform **shared database, shared schema** mimarisi kullanır. Her tabloda `tenant_id` kolonu bulunur ve Eloquent global scope ile otomatik filtrelenir.

```php
// app/Models/Traits/BelongsToTenant.php
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope());

        static::creating(function ($model) {
            if (auth()->check() && !$model->tenant_id) {
                $model->tenant_id = auth()->user()->tenant_id;
            }
        });
    }
}
```

### Subdomain Yönlendirme

```php
// routes/web.php
Route::domain('{tenant}.platform.com')->group(function () {
    Route::middleware('resolve.tenant')->group(function () {
        // tüm rotalar
    });
});
```

---

## 8. PDF Pipeline

```
[Kullanıcı PDF Yükler]
       │
       ▼
[S3/MinIO'ya Kaydedilir] → book.render_status = 'pending'
       │
       ▼
[ProcessPdfBook Job → Queue]
       │
       ▼
[PHP → FastAPI: POST /render { pdf_url, book_id }]
       │
       ▼
[Python: PyMuPDF her sayfayı 150dpi WebP'ye render eder]
[Python: pdfplumber metin koordinatlarını çıkarır]
       │
       ▼
[WebP + JSON koordinatlar S3'a yazılır]
       │
       ▼
[book_pages tablosu oluşturulur]
[book.render_status = 'completed']
       │
       ▼
[WebSocket Event → Frontend ilerleme bildirimi alır]
```

---

## 9. Auth & RBAC

### Token Yapısı (Sanctum)

```
Authorization: Bearer <token>
```

Her token'a `ability` (kapsam) atanır:

```php
$token = $user->createToken('web-client', ['student:read', 'assignment:submit']);
```

### Route Koruma Katmanları

```php
Route::middleware(['auth:sanctum', 'check.role:TEACHER', 'tenant.scope'])
    ->prefix('v1/teacher')
    ->group(function () {
        Route::apiResource('assignments', Teacher\AssignmentController::class);
    });
```

### İzin Matrisi

| Eylem | STUDENT | TEACHER | PARENT | INST_ADMIN | SUPER_ADMIN |
|-------|---------|---------|--------|-----------|-------------|
| Kitap okuma | ✅ (atanan) | ✅ | ❌ | ✅ | ✅ |
| Ödev oluşturma | ❌ | ✅ | ❌ | ✅ | ✅ |
| Test çözme | ✅ | ❌ | ❌ | ❌ | ❌ |
| Sınıf raporu | ❌ | ✅ | ❌ | ✅ | ✅ |
| Kullanıcı yönetimi | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kurum oluşturma | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 10. API Sözleşmesi

### Base URL

```
Production : https://api.platform.com/api/v1
Staging    : https://api.staging.platform.com/api/v1
Local      : http://localhost:8000/api/v1
```

### Önemli Endpoint'ler

```
# Auth
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password

# Kitaplar
GET    /books
POST   /books                        (SUPER_ADMIN)
GET    /books/{id}
POST   /books/{id}/assign-to-class   (INSTITUTION_ADMIN)

# PDF Pipeline
POST   /books/{id}/render            (SUPER_ADMIN)
GET    /books/{id}/render/status

# Ödevler
GET    /teacher/assignments
POST   /teacher/assignments
GET    /teacher/assignments/{id}/results
GET    /student/assignments
POST   /student/assignments/{id}/submit

# Raporlar
GET    /institution/reports/dashboard
GET    /institution/reports/students/{id}
GET    /institution/reports/classrooms
POST   /institution/reports/export   (PDF/Excel)
```

---

## 11. Environment Değişkenleri

```env
# Uygulama
APP_NAME="Dijital Eğitim Platformu"
APP_ENV=production
APP_URL=https://api.platform.com
FRONTEND_URL=https://platform.com

# Veritabanı
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dijital_egitim
DB_USERNAME=
DB_PASSWORD=

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis
PDF_QUEUE=pdf-processing

# Dosya Depolama
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=eu-central-1
AWS_BUCKET=dijital-egitim-prod
AWS_URL=https://cdn.platform.com

# Python PDF Service
PDF_SERVICE_URL=http://pdf-service:8001
PDF_SERVICE_SECRET=

# Mail
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@platform.com

# Realtime (WebSocket)
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443

# Hata Takibi
SENTRY_LARAVEL_DSN=
```

---

## 12. CI/CD & Deployment

### GitHub Actions Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: PHP Tests
        run: php artisan test --coverage
      - name: Frontend Tests
        run: npm run test

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: # SSH → pull → migrate → queue restart

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production   # Manuel onay gerektirir
    steps:
      - name: Deploy to Production
        run: # SSH → pull → migrate → queue restart
```

---

## 13. Sprint Planı

Toplam: **864 saat | 3 kişi | ~14-16 hafta**

| Sprint | Hafta | Kapsam | Efor |
|--------|-------|--------|------|
| Sprint 1 | 1-2 | Altyapı, Auth, Multi-Tenant | 124 saat |
| Sprint 2 | 3-4 | Kullanıcı Yönetimi, PDF Yükleme | 82 saat |
| Sprint 3 | 5-7 | PDF Pipeline, Sayfa Render | 70 saat |
| Sprint 4 | 8-9 | İçerik Editörü, Hotspot | 68 saat |
| Sprint 5 | 10-11 | Öğrenci & Öğretmen Paneli | 122 saat |
| Sprint 6 | 12 | Veli & Kurum Paneli, Bildirimler | 110 saat |
| Sprint 7 | 13 | Analitik, Raporlama, Güvenlik | 104 saat |
| Sprint 8 | 14-15 | Test, QA, Polish, DevOps | 106 saat |
| Sprint 9 | 15-16 | Deployment, Dokümantasyon, Eğitim | 78 saat |

> **Not:** Her sprint Pazartesi günü planlama, Cuma günü demo ile kapanır.  
> Müşteri demoları Sprint 3, Sprint 5 ve Sprint 7 sonunda yapılır.  
> Maksimum 3 büyük revizyon hakkı tanımlanmıştır; sonraki revizyonlar saat bazlı faturalanır.

---

> Bu doküman yaşayan bir belgedir.  
> Her sprint başında güncellenebilir. Değişiklik önerileri için PR açılır.
