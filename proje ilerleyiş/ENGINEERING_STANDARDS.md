# Engineering Standards & Clean Code Guide

> Dijital Eğitim Platformu — Tüm Repolar için Geçerli Mühendislik Standartları  
> Sürüm: 1.0 | Son güncelleme: Haziran 2025

---

## İçindekiler

1. [Temel Prensipler](#1-temel-prensipler)
2. [SOLID Prensipleri](#2-solid-prensipleri)
3. [MVC Mimarisi](#3-mvc-mimarisi)
4. [Klasör & Dosya Yapısı](#4-klasör--dosya-yapısı)
5. [Kodlama Standartları](#5-kodlama-standartları)
6. [API Tasarım Kuralları](#6-api-tasarım-kuralları)
7. [Veritabanı Standartları](#7-veritabanı-standartları)
8. [Test Stratejisi](#8-test-stratejisi)
9. [Git Workflow](#9-git-workflow)
10. [Güvenlik Kuralları](#10-güvenlik-kuralları)
11. [Performans Kuralları](#11-performans-kuralları)
12. [Dokümantasyon](#12-dokümantasyon)

---

## 1. Temel Prensipler

### 1.1 DRY — Don't Repeat Yourself

Aynı mantık **asla** iki yerde yazılmaz. Tekrar eden her şey bir servis, helper veya utility'ye taşınır.

```php
// ❌ YANLIŞ — iki controller'da aynı hesaplama
class ReportController {
    public function index() {
        $rate = ($student->correct / $student->total) * 100; // tekrar
    }
}
class DashboardController {
    public function index() {
        $rate = ($student->correct / $student->total) * 100; // tekrar
    }
}

// ✅ DOĞRU — servis katmanında tek yer
class StudentStatsService {
    public function successRate(Student $student): float {
        if ($student->total === 0) return 0.0;
        return round(($student->correct / $student->total) * 100, 2);
    }
}
```

### 1.2 KISS — Keep It Simple, Stupid

Her fonksiyon **tek bir şey** yapar. Karmaşık bir şey görürsen, parçalara böl.

```php
// ❌ YANLIŞ — bir metod her şeyi yapıyor
public function processAssignment($data) {
    // validation
    // create assignment
    // notify students
    // send parent email
    // log activity
}

// ✅ DOĞRU — sorumluluklar ayrılmış
public function store(StoreAssignmentRequest $request) {
    $assignment = $this->assignmentService->create($request->validated());
    $this->notificationService->notifyStudents($assignment);
    $this->activityLogger->log('assignment.created', $assignment);
    return AssignmentResource::make($assignment);
}
```

### 1.3 YAGNI — You Aren't Gonna Need It

İhtiyaç duyulmayan özellik **yazılmaz**. "İleride lazım olur" düşüncesiyle kod üretilmez.

---

## 2. SOLID Prensipleri

### S — Single Responsibility Principle

Her sınıf **tek bir sorumluluğa** sahip olur ve yalnızca o nedenden ötürü değişir.

```php
// ❌ YANLIŞ — tek sınıf her şeyi yapıyor
class UserManager {
    public function createUser() { ... }
    public function sendWelcomeEmail() { ... }
    public function generateReport() { ... }
    public function logActivity() { ... }
}

// ✅ DOĞRU — sorumluluklar dağıtılmış
class UserService       { public function create(array $data): User { ... } }
class UserMailer        { public function sendWelcome(User $user): void { ... } }
class UserReportService { public function generate(User $user): array { ... } }
class ActivityLogger    { public function log(string $event, $model): void { ... } }
```

### O — Open/Closed Principle

Sınıflar genişlemeye **açık**, değişikliğe **kapalı** olur.

```php
// ❌ YANLIŞ — yeni bildirim tipi eklemek mevcut kodu kırar
class NotificationService {
    public function send(string $type, $data) {
        if ($type === 'email') { /* email kodu */ }
        elseif ($type === 'sms') { /* sms kodu */ }
        elseif ($type === 'push') { /* her yeni tip buraya eklenir */ }
    }
}

// ✅ DOĞRU — interface + bağımlılık enjeksiyonu
interface NotificationChannel {
    public function send(Notification $notification): void;
}

class EmailChannel implements NotificationChannel { ... }
class SmsChannel   implements NotificationChannel { ... }
class PushChannel  implements NotificationChannel { ... }

class NotificationService {
    public function __construct(
        private readonly array $channels // yeni kanal eklemek bu sınıfı değiştirmez
    ) {}

    public function send(Notification $notification): void {
        foreach ($this->channels as $channel) {
            $channel->send($notification);
        }
    }
}
```

### L — Liskov Substitution Principle

Alt sınıflar, üst sınıfın yerine geçebilir olmalıdır; davranış bozulmamalıdır.

```php
// ✅ DOĞRU
abstract class PdfProcessor {
    abstract public function render(string $path): array; // sayfaları döner
}

class MuPdfProcessor extends PdfProcessor {
    public function render(string $path): array { /* PyMuPDF ile */ }
}

class PdfJsProcessor extends PdfProcessor {
    public function render(string $path): array { /* pdf.js ile */ }
}

// Her iki sınıf da PdfProcessor bekleyen yerde kullanılabilir
```

### I — Interface Segregation Principle

Büyük interface'ler parçalanır; sınıflar kullanmadıkları metotları implemente etmek zorunda kalmaz.

```php
// ❌ YANLIŞ — dev bir interface
interface UserInterface {
    public function read(): array;
    public function write(array $data): void;
    public function delete(): void;
    public function exportPdf(): string;
    public function sendEmail(): void;
}

// ✅ DOĞRU — küçük, odaklı interface'ler
interface Readable    { public function read(): array; }
interface Writable    { public function write(array $data): void; }
interface Deletable   { public function delete(): void; }
interface Exportable  { public function exportPdf(): string; }
interface Mailable    { public function sendEmail(): void; }

class StudentRepository implements Readable, Writable { ... }
class ReportService    implements Readable, Exportable { ... }
```

### D — Dependency Inversion Principle

Üst seviye modüller, alt seviye modüllere değil; **soyutlamalara** bağlıdır.

```php
// ❌ YANLIŞ — doğrudan somut sınıfa bağımlı
class AssignmentService {
    private EmailNotifier $notifier; // somut sınıfa bağlı

    public function __construct() {
        $this->notifier = new EmailNotifier(); // sıkı bağlantı
    }
}

// ✅ DOĞRU — interface üzerinden bağlantı, container inject eder
class AssignmentService {
    public function __construct(
        private readonly NotificationChannel $notifier // soyutlamaya bağlı
    ) {}
}
```

---

## 3. MVC Mimarisi

Proje katı bir **MVC + Service Layer** mimarisi kullanır. Controller'lar ince, servisler kalın olur.

```
Request → Middleware → Controller → Service → Repository → Model → DB
                          ↓
                      Resource (Response)
```

### Controller Kuralları

Controller yalnızca şunları yapar:
1. Request'i valide et (FormRequest sınıfı ile)
2. Servisi çağır
3. Resource ile yanıt dön

```php
// ✅ İdeal controller — 10-15 satır
class AssignmentController extends Controller
{
    public function __construct(
        private readonly AssignmentService $service
    ) {}

    public function store(StoreAssignmentRequest $request): JsonResponse
    {
        $assignment = $this->service->create(
            $request->validated(),
            $request->user()
        );

        return AssignmentResource::make($assignment)
            ->response()
            ->setStatusCode(201);
    }
}
```

### Service Layer Kuralları

İş mantığının tamamı burada yaşar. Servisler başka servisleri çağırabilir; ancak döngüsel bağımlılık olmaz.

```php
class AssignmentService
{
    public function __construct(
        private readonly AssignmentRepository $repository,
        private readonly NotificationService  $notificationService,
        private readonly ActivityLogger       $logger,
    ) {}

    public function create(array $data, User $teacher): Assignment
    {
        $assignment = $this->repository->create($data, $teacher);

        $this->notificationService->notifyStudents($assignment);
        $this->logger->log('assignment.created', $assignment, $teacher);

        return $assignment;
    }
}
```

### Repository Kuralları

Veritabanı sorgularının tamamı repository'de bulunur. Model'e doğrudan sorgu Controller veya Service'ten yazılmaz.

```php
interface AssignmentRepositoryInterface
{
    public function findById(int $id): Assignment;
    public function create(array $data, User $teacher): Assignment;
    public function findByClassWithStudents(int $classId): Collection;
}

class AssignmentRepository implements AssignmentRepositoryInterface
{
    public function findByClassWithStudents(int $classId): Collection
    {
        return Assignment::query()
            ->where('class_id', $classId)
            ->with(['students', 'teacher', 'book'])
            ->orderByDesc('created_at')
            ->get();
    }
}
```

---

## 4. Klasör & Dosya Yapısı

### Backend (Laravel)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/V1/
│   │   │   ├── Auth/
│   │   │   ├── Student/
│   │   │   ├── Teacher/
│   │   │   ├── Parent/
│   │   │   └── Admin/
│   ├── Requests/          ← Validation burada
│   ├── Resources/         ← API response dönüşümü
│   └── Middleware/
├── Services/              ← İş mantığı
│   ├── Assignment/
│   ├── Notification/
│   ├── Pdf/
│   └── Report/
├── Repositories/          ← DB erişim katmanı
│   ├── Contracts/         ← Interface'ler
│   └── Eloquent/          ← Implementasyonlar
├── Models/
├── Events/
├── Listeners/
├── Jobs/                  ← Kuyruk işleri
├── Policies/              ← Yetkilendirme
└── Exceptions/
```

### Frontend (Next.js / Nuxt)

```
src/
├── components/
│   ├── ui/                ← Atomic: Button, Input, Modal
│   ├── common/            ← Shared: Navbar, Sidebar
│   └── features/          ← Feature-specific
│       ├── pdf-viewer/
│       ├── assignment/
│       └── dashboard/
├── pages/ (veya app/)
│   ├── student/
│   ├── teacher/
│   ├── parent/
│   └── admin/
├── services/              ← API çağrıları
├── hooks/                 ← Custom React/Vue hooks
├── stores/                ← State management
├── types/                 ← TypeScript tipleri
└── utils/                 ← Yardımcı fonksiyonlar
```

---

## 5. Kodlama Standartları

### 5.1 İsimlendirme Kuralları

| Bağlam | Kural | Örnek |
|--------|-------|-------|
| PHP sınıfı | PascalCase | `AssignmentService` |
| PHP metot | camelCase | `createAssignment()` |
| PHP değişken | camelCase | `$studentScore` |
| DB tablo | snake_case çoğul | `assignment_submissions` |
| DB sütun | snake_case | `submitted_at` |
| Route | kebab-case | `/api/v1/class-rooms` |
| JS/TS değişken | camelCase | `studentScore` |
| JS/TS bileşen | PascalCase | `AssignmentCard.tsx` |
| Sabit | UPPER_SNAKE | `MAX_FILE_SIZE_MB` |

### 5.2 Fonksiyon Uzunluğu

Bir fonksiyon **20 satırı** geçmemelidir. Geçiyorsa parçalanır.

### 5.3 Parametre Sayısı

Bir fonksiyon en fazla **3 parametre** alır. Daha fazlası gerekiyorsa DTO (Data Transfer Object) veya array kullanılır.

```php
// ❌ YANLIŞ
public function createUser(string $name, string $email, string $password, int $roleId, int $tenantId) {}

// ✅ DOĞRU — DTO kullanımı
class CreateUserDTO {
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly int    $roleId,
        public readonly int    $tenantId,
    ) {}
}

public function createUser(CreateUserDTO $dto): User {}
```

### 5.4 Early Return (Guard Clause)

Derin if-else zincirleri yerine erken çıkış kullanılır.

```php
// ❌ YANLIŞ
public function process(Assignment $assignment): void {
    if ($assignment->exists) {
        if ($assignment->isActive()) {
            if (!$assignment->isExpired()) {
                // asıl iş
            }
        }
    }
}

// ✅ DOĞRU — early return
public function process(Assignment $assignment): void {
    if (!$assignment->exists)    return;
    if (!$assignment->isActive()) return;
    if ($assignment->isExpired()) return;

    // asıl iş
}
```

### 5.5 Magic Number Yasağı

Sayısal sabitler asla doğrudan kodda kullanılmaz.

```php
// ❌ YANLIŞ
if ($fileSize > 52428800) { ... }

// ✅ DOĞRU
const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
if ($fileSize > self::MAX_PDF_SIZE_BYTES) { ... }
```

---

## 6. API Tasarım Kuralları

### 6.1 Versiyonlama

Tüm endpoint'ler `/api/v1/` prefix'i alır. Breaking change durumunda `/api/v2/` açılır.

### 6.2 RESTful Kaynak Adları

```
GET    /api/v1/assignments           → Liste
POST   /api/v1/assignments           → Oluştur
GET    /api/v1/assignments/{id}      → Tekil
PUT    /api/v1/assignments/{id}      → Güncelle (tüm alanlar)
PATCH  /api/v1/assignments/{id}      → Kısmi güncelle
DELETE /api/v1/assignments/{id}      → Sil

GET    /api/v1/assignments/{id}/submissions   → Alt kaynak
```

### 6.3 Tutarlı Response Formatı

**Başarılı:**
```json
{
  "data": { "id": 1, "title": "Matematik Ödevi" },
  "meta": { "page": 1, "per_page": 15, "total": 120 }
}
```

**Hata:**
```json
{
  "message": "Validation failed.",
  "errors": {
    "title": ["Başlık zorunludur."],
    "due_date": ["Geçmiş tarih girilemez."]
  }
}
```

### 6.4 HTTP Durum Kodları

| Durum | Kod |
|-------|-----|
| Başarılı liste / tekil | 200 |
| Kayıt oluşturuldu | 201 |
| Silindi | 204 |
| Validation hatası | 422 |
| Yetkisiz | 401 |
| Yasak (RBAC) | 403 |
| Bulunamadı | 404 |
| Sunucu hatası | 500 |

---

## 7. Veritabanı Standartları

### 7.1 Migration Kuralları

Her migration **geri alınabilir** (`down()` metodu eksiksiz doldurulur).  
Migration dosyaları bir kez commit edildikten sonra düzenlenmez; düzeltme için yeni migration yazılır.

### 7.2 İndeks Kuralları

```php
// Foreign key her zaman indekslenir
$table->foreignId('student_id')->constrained()->index();

// Sık filtrelenen kolonlar
$table->index(['tenant_id', 'created_at']); // birleşik indeks

// Unique kısıtlamalar açık tanımlanır
$table->unique(['tenant_id', 'email']);
```

### 7.3 Soft Delete

Kullanıcı, okul, ödev ve tüm önemli kayıtlar `SoftDeletes` trait'i kullanır. Kayıtlar asla fiziksel silinmez.

### 7.4 N+1 Yasağı

Her liste sorgusunda ilişkiler `with()` ile eager load edilir. N+1 query Telescope / Debugbar ile izlenir ve kod review'da reddedilir.

```php
// ❌ YANLIŞ — N+1
$students = Student::all();
foreach ($students as $student) {
    echo $student->class->name; // her iterasyonda 1 sorgu
}

// ✅ DOĞRU
$students = Student::with('class')->get(); // tek sorgu
```

---

## 8. Test Stratejisi

### 8.1 Test Piramidi

```
         [ E2E ]          ← Az, yavaş, kritik akışlar
       [ Integration ]    ← Orta, servis + DB
     [ Unit Tests ]       ← Çok, hızlı, izole
```

### 8.2 Test Yazma Kuralları

Her test **AAA (Arrange → Act → Assert)** yapısını izler:

```php
/** @test */
public function teacher_can_create_assignment_for_their_class(): void
{
    // Arrange
    $teacher    = Teacher::factory()->create();
    $classroom  = Classroom::factory()->for($teacher)->create();
    $assignData = ['title' => 'Matematik Ödevi', 'due_date' => now()->addDays(7)];

    // Act
    $response = $this->actingAs($teacher)
        ->postJson('/api/v1/assignments', $assignData);

    // Assert
    $response->assertStatus(201)
             ->assertJsonPath('data.title', 'Matematik Ödevi');

    $this->assertDatabaseHas('assignments', ['title' => 'Matematik Ödevi']);
}
```

### 8.3 Coverage Hedefi

| Katman | Min. Coverage |
|--------|--------------|
| Service | %80 |
| Repository | %70 |
| Controller (integration) | %60 |
| E2E kritik akışlar | 5 senaryo |

---

## 9. Git Workflow

### 9.1 Branch Stratejisi (Git Flow)

```
main          ← production (sadece tag ile)
develop       ← integration branch
feature/xxx   ← yeni özellik
bugfix/xxx    ← hata düzeltme
hotfix/xxx    ← prod'a acil düzeltme
release/x.x.x ← sürüm hazırlık
```

### 9.2 Commit Mesajı Formatı (Conventional Commits)

```
<type>(<scope>): <kısa açıklama>

[opsiyonel gövde]

[opsiyonel footer]
```

| Type | Kullanım |
|------|----------|
| `feat` | Yeni özellik |
| `fix` | Hata düzeltme |
| `refactor` | Yeniden yapılandırma |
| `test` | Test ekleme/düzeltme |
| `docs` | Dokümantasyon |
| `chore` | Build, bağımlılık |
| `perf` | Performans iyileştirme |

**Örnekler:**
```
feat(assignment): ödev oluşturma endpoint'i eklendi
fix(auth): JWT token yenileme döngüsü düzeltildi
refactor(pdf): render servisi bağımlılık enjeksiyonuna alındı
test(student): test çözme akışı için E2E senaryo eklendi
```

### 9.3 Pull Request Kuralları

- Her PR tek bir konuya odaklanır
- PR açılmadan önce `develop`'tan rebase yapılır
- En az **1 reviewer** onayı zorunludur
- CI (test + lint) geçmeden merge yapılmaz
- PR açıklaması şablona uygun doldurulur

### 9.4 PR Açıklama Şablonu

```markdown
## Ne Değişti?
<!-- Kısa açıklama -->

## Neden?
<!-- Motivasyon / bağlantılı issue -->

## Test Edildi mi?
- [ ] Unit test yazıldı
- [ ] Manuel test yapıldı
- [ ] Screenshot / video eklendi (UI değişikliği varsa)

## Ekran Görüntüsü
<!-- UI değişikliği yoksa bu bölümü sil -->
```

---

## 10. Güvenlik Kuralları

### 10.1 Asla Yapılmaması Gerekenler

```php
// ❌ API key / secret asla kod içinde
$apiKey = 'sk-ant-...'; // YASAK

// ❌ Raw SQL ile user input
DB::select("SELECT * FROM users WHERE id = $userId"); // SQL Injection riski

// ❌ Doğrulama olmadan file upload kabul etme
$file = $request->file('pdf'); // tip/boyut kontrolü şart

// ❌ Hassas veriyi loglama
Log::info('User login', ['password' => $request->password]); // YASAK
```

### 10.2 Her Zaman Yapılması Gerekenler

- Tüm gizli değerler `.env` dosyasında; `.env` asla git'e eklenmez
- Her request FormRequest ile doğrulanır
- Multi-tenant sorgularda `tenant_id` filtresi global scope ile zorunlu tutulur
- File upload'da MIME type sunucu tarafında kontrol edilir
- Rate limiting hassas endpoint'lere (login, şifre sıfırlama) uygulanır

---

## 11. Performans Kuralları

### 11.1 Caching Stratejisi

```
Statik config verileri    → Cache::forever()
Liste sorguları           → Cache::remember(key, 300)  // 5 dk
Kullanıcı bazlı veri      → Cache tag + kullanıcı ID
PDF render çıktıları      → S3/MinIO + CDN
```

Cache key'leri tutarlı ve çakışmayacak şekilde isimlendirilir:

```php
$key = "tenant:{$tenantId}:student:{$studentId}:stats";
```

### 11.2 Kuyruk (Queue) Kuralları

Uzun süren işler (PDF render, e-posta, rapor üretimi) asla senkron çalıştırılmaz; her zaman queue'ya atılır.

```php
// ❌ YANLIŞ — istek içinde PDF render
public function store(Request $request) {
    $this->pdfService->render($book); // kullanıcı bekler
}

// ✅ DOĞRU — queue job
public function store(Request $request) {
    RenderPdfBookJob::dispatch($book)->onQueue('pdf-processing');
    return response()->json(['status' => 'processing'], 202);
}
```

---

## 12. Dokümantasyon

### 12.1 Kod İçi Yorum Kuralları

Yorumlar **ne** yapıldığını değil, **neden** yapıldığını açıklar.

```php
// ❌ YANLIŞ — kodu tekrar eden yorum
// Öğrenci skoru al
$score = $student->score;

// ✅ DOĞRU — neden yapıldığını açıklayan yorum
// Sıfır bölme hatasını önlemek için toplam soru sayısı 0 ise erken dönüyoruz.
// Bu durum henüz çözülmemiş ödevlerde oluşabilir.
if ($student->total_questions === 0) return null;
```

### 12.2 PHPDoc / JSDoc

Public metotlar dokümante edilir:

```php
/**
 * Öğrenciye ait tüm aktif ödevleri döner.
 *
 * @param  int  $studentId
 * @param  int  $tenantId   Multi-tenant izolasyonu için zorunlu
 * @return Collection<Assignment>
 * @throws ModelNotFoundException Öğrenci bulunamazsa
 */
public function getActiveAssignments(int $studentId, int $tenantId): Collection
```

### 12.3 README Zorunlu Bölümleri

Her repo'nun `README.md` dosyası şunları içerir:

1. Projeye genel bakış (2-3 cümle)
2. Gereksinimler (PHP/Node versiyonu, DB, vb.)
3. Kurulum adımları (`git clone` → `composer install` → `.env.example` → vb.)
4. Ortam değişkenleri tablosu
5. Test çalıştırma komutu
6. Deployment notları

---

> **Not:** Bu belge yaşayan bir dokümandır. Ekip içi kararlarla güncellenebilir.  
> Değişiklik önerileri için PR açılır ve ekip içinde tartışılır.
