# === Step 1: Используем PHP 8.2 FPM образ
FROM php:8.2-fpm

# === Step 2: Установка системных пакетов и PHP расширений
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libonig-dev \
    libpq-dev \
    curl \
    && docker-php-ext-install pdo pdo_mysql zip bcmath opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# === Step 3: Установка Composer из официального образа
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# === Step 4: Рабочая директория
WORKDIR /var/www

# === Step 5: Копирование всего проекта
COPY . .

# === Step 6: Установка зависимостей Laravel
RUN composer install --no-dev --optimize-autoloader -vvv

# === Step 7: Генерация ключа приложения (если не передан через ENV)
RUN php artisan key:generate || true

# === Step 8: Права на storage и cache
RUN chown -R www-data:www-data storage bootstrap/cache

# === Step 9: Порт для PHP-FPM
EXPOSE 9000

# === Step 10: Старт PHP-FPM
CMD ["php-fpm"]
