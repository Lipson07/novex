FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo_mysql zip

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan key:generate

EXPOSE 9000

CMD ["php-fpm"]
