<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the users for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Rol filtrelemesi
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Arama filtrelemesi
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $users = $query->latest()->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        // Tenant id otomatik olarak trait/scope sayesinde eklenebilir veya auth user'dan alınabilir.
        // Ancak BelongsToTenant scope'u saving event'inde auth()->user()->tenant_id'yi basıyor mu?
        // Biz manuel olarak tenant_id verelim ki güvenilir olsun.
        
        $user = new User($request->validated());
        $user->password = Hash::make($request->password);
        
        // Tenant ID ata (eğer Super Admin değilse ve tenant_id'si varsa)
        if (auth()->user()->tenant_id) {
            $user->tenant_id = auth()->user()->tenant_id;
        }

        $user->save();

        // Rol ataması
        $user->assignRole($request->role);

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı başarıyla eklendi.',
            'data' => $user
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();
        
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı başarıyla güncellendi.',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        // Kendi kendini silmeyi engelle
        if (auth()->id() === $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kendi hesabınızı silemezsiniz.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı başarıyla silindi.'
        ]);
    }
}
