FROM php:8.2-fpm

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    nginx supervisor curl \
 && docker-php-ext-install pdo_mysql zip gd \
 && rm -rf /var/lib/apt/lists/*

# Установка composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

# Копируем только composer-файлы для кеша
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Копируем весь проект
COPY . .

# Права для Laravel
RUN chown -R www-data:www-data /var/www/backend \
 && chmod -R 775 storage bootstrap/cache

# Копируем конфиги
COPY docker/nginx.conf /etc/nginx/sites-enabled/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n"]
    