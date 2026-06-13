<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Kullanıcı girişi ve token üretimi
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            // tenant_id isteğe bağlı gönderilebilir, eğer aynı email birden fazla tenant'ta varsa vs.
            // Fakat genelde email sistemde tektir veya subdomain üzerinden tenant_id çözümlenir.
            // Şimdilik sadece email/password kullanıyoruz.
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['E-posta adresi veya şifre hatalı.'],
            ]);
        }

        // Eğer kullanıcı varsa ve aktif değilse vb. kontroller yapılabilir
        
        // Token'a kullanıcının rolünü yetenek (ability) olarak ekliyoruz
        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'tenant_id' => $user->tenant_id,
                'avatar_url' => $user->avatar_url,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Oturumu kapatma
     */
    public function logout(Request $request)
    {
        // Mevcut kullanıcının geçerli token'ını siler
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Başarıyla çıkış yapıldı.'
        ]);
    }

    /**
     * Oturum açmış kullanıcının bilgilerini getirme
     */
    public function me(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'tenant_id' => $user->tenant_id,
                'avatar_url' => $user->avatar_url,
            ]
        ]);
    }
}
