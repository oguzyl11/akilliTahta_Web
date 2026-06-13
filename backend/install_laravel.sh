#!/bin/bash
set -e

echo "Laravel projesi kuruluyor..."

# Mevcut dizinin içindekileri sil (sadece baştan kurulum yapıyorsak)
# rm -rf * .* 2>/dev/null || true

# Geçici bir dizinde oluştur
composer create-project laravel/laravel tmp_laravel

# Dosyaları ana dizine taşı
cp -a tmp_laravel/. ./
rm -rf tmp_laravel

echo "Bağımlılıklar yükleniyor (Spatie Permission, vs)..."
composer require spatie/laravel-permission

echo "Sail kurmaya gerek yok, kendi docker ortamımız var."

# Sanctum ve Permission kurulumları için publish
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

echo "Telescope kurulumu (sadece dev)..."
composer require laravel/telescope --dev
php artisan telescope:install

echo "Kurulum tamamlandı!"
