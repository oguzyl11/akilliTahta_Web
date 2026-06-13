<?php

namespace App\Models\Traits;

use App\Models\Scopes\TenantScope;

trait BelongsToTenant
{
    /**
     * Boot the trait.
     */
    protected static function bootBelongsToTenant(): void
    {
        // Global scope ekleniyor
        static::addGlobalScope(new TenantScope());

        // Model oluşturulurken tenant_id atanıyor (eğer user giriş yapmışsa ve değer yoksa)
        static::creating(function ($model) {
            if (auth()->check() && !$model->tenant_id) {
                // Sadece SUPER_ADMIN yetkisi yoksa veya atamamışsa tenant_id bekle, ama tenant yapısı genelde otomatik işler
                $user = auth()->user();
                if ($user->tenant_id) {
                    $model->tenant_id = $user->tenant_id;
                }
            }
        });
    }
}
