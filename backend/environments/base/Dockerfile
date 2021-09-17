FROM php:8.0-apache

# Install PHP and composer dependencies
RUN apt-get update
RUN apt-get install -y git curl libmcrypt-dev libjpeg-dev libpng-dev libonig-dev libfreetype6-dev libbz2-dev libzip-dev zip unzip

# mod_rewrite for URL rewrite and mod_headers for .htaccess extra headers like Access-Control-Allow-Origin-
RUN a2enmod rewrite headers

# Start with base php config
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Install base PHP extensions
RUN docker-php-ext-install opcache pdo_mysql mysqli zip

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Redis
RUN pecl install -o -f redis \
    &&  rm -rf /tmp/pear \
    &&  docker-php-ext-enable redis