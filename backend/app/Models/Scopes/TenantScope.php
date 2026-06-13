<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // Eğer giriş yapmış bir kullanıcı varsa ve tenant_id'ye sahipse (SUPER_ADMIN değilse)
        // Ya da tenant_id ile filtrelememiz gerekiyorsa
        if (auth()->check()) {
            $user = auth()->user();
            
            // Kullanıcının tenant_id'si varsa (SUPER_ADMIN'in tenant_id'si null olabilir)
            // Ya da spesifik bir role sahip değilse kısıtla
            if ($user->tenant_id !== null) {
                $builder->where($model->getTable() . '.tenant_id', $user->tenant_id);
            }
        }
    }
}
