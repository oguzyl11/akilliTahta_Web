<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tenants (Okullar/Kurumlar)
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subdomain')->unique();
            $table->string('logo_url')->nullable();
            $table->string('primary_color')->default('#4f46e5');
            $table->string('license_type')->default('basic');
            $table->integer('user_limit')->default(100);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Users (Rol ve Tenant ID Eklendi)
        // Laravel varsayılanında users tablosu vardır ancak bunu eziyoruz veya güncelliyoruz.
        // Eğer Laravel 11 varsayılan migration'ı duruyorsa, bu onu ezer mi? Hayır.
        // O yüzden users tablosunu değiştirmek yerine tenant_id vb. kolonlar ekliyoruz.
        // Bunu Laravel 11'in default users migration'ının çalışmasından sonra yapacak şekilde
        // Blueprint::table kullanarak alter etmeliyiz.

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->string('role')->default('STUDENT'); // STUDENT, TEACHER, PARENT, INSTITUTION_ADMIN, SUPER_ADMIN
            $table->string('avatar_url')->nullable();
            $table->softDeletes();
        });

        // 3. Classrooms (Sınıflar)
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name'); // Örn: 8-A
            $table->integer('grade_level'); // Örn: 8
            $table->string('branch')->nullable(); // Örn: A
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('academic_year')->default('2025-2026');
            $table->timestamps();
        });

        // 4. Students
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
            $table->string('student_number')->nullable();
            $table->string('tc_identity_encrypted')->nullable(); // KVKK
            $table->timestamps();
        });

        // 5. Parent - Student İlişkisi
        Schema::create('parent_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('relation_type')->default('parent'); // parent, guardian vb.
            $table->timestamps();
        });

        // 6. Books (Kitaplar)
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete(); // Null ise tüm kurumlar için global
            $table->string('title');
            $table->string('subject')->nullable();
            $table->integer('grade_level')->nullable();
            $table->string('cover_url')->nullable();
            $table->string('pdf_url');
            $table->bigInteger('pdf_size_bytes')->default(0);
            $table->integer('version')->default(1);
            $table->string('render_status')->default('pending'); // pending, processing, completed, failed
            $table->integer('page_count')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 7. Book Pages (Sayfalar)
        Schema::create('book_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->integer('page_number');
            $table->string('image_url');
            $table->integer('image_width')->default(0);
            $table->integer('image_height')->default(0);
            $table->jsonb('text_coords')->nullable();
            $table->timestamps();
        });

        // 8. Hotspots (Etkileşimli Alanlar)
        Schema::create('hotspots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_page_id')->constrained('book_pages')->cascadeOnDelete();
            $table->string('type'); // video, question, popup, link
            $table->decimal('x', 8, 4);
            $table->decimal('y', 8, 4);
            $table->decimal('width', 8, 4);
            $table->decimal('height', 8, 4);
            $table->jsonb('payload')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 9. Questions (Sorular)
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotspot_id')->constrained('hotspots')->cascadeOnDelete();
            $table->string('type'); // multiple_choice, true_false, fill_blank, match
            $table->text('body');
            $table->jsonb('options')->nullable();
            $table->jsonb('correct_answer');
            $table->text('explanation')->nullable();
            $table->integer('points')->default(10);
            $table->timestamps();
        });
        
        // 10. Assignments (Ödevler)
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('classroom_id')->constrained('classrooms')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('due_date')->nullable();
            $table->string('status')->default('active'); // draft, active, closed
            $table->timestamps();
            $table->softDeletes();
        });

        // 11. Assignment Submissions (Ödev Teslimleri)
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('status')->default('not_started'); // not_started, in_progress, submitted
            $table->decimal('score', 5, 2)->nullable();
            $table->decimal('max_score', 5, 2)->nullable();
            $table->dateTime('submitted_at')->nullable();
            $table->timestamps();
        });

        // 12. Question Answers (Cevaplar)
        Schema::create('question_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->nullable()->constrained('assignment_submissions')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->jsonb('given_answer')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->integer('time_spent_seconds')->default(0);
            $table->timestamps();
        });
        
        // 13. Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('event_name');
            $table->string('loggable_type')->nullable();
            $table->unsignedBigInteger('loggable_id')->nullable();
            $table->jsonb('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('question_answers');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('hotspots');
        Schema::dropIfExists('book_pages');
        Schema::dropIfExists('books');
        Schema::dropIfExists('parent_student');
        Schema::dropIfExists('students');
        Schema::dropIfExists('classrooms');
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
            $table->dropColumn(['tenant_id', 'role', 'avatar_url', 'deleted_at']);
        });

        Schema::dropIfExists('tenants');
    }
};
