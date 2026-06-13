#!/bin/bash
set -e

# Sadece artisan dosyası varsa Laravel komutlarını çalıştır
if [ -f "artisan" ]; then
    # .env dosyası yoksa oluştur (development için)
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            php artisan key:generate
        fi
    fi

    # Önbelleği temizle
    php artisan config:clear
    php artisan cache:clear

    # Veritabanı ve Migration işlemleri (opsiyonel)
    # php artisan migrate --force
else
    echo "Artisan bulunamadı, Laravel kurulumu bekleniyor..."
fi

# İlk argüman `-` ile başlıyorsa (örn: -f, --help) onu komuta dahil et
if [ "${1#-}" != "$1" ]; then
    set -- php-fpm "$@"
fi

exec "$@"
