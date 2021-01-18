# Change the image version if you want to test it on other php version.
# versions are listed on https://hub.docker.com/_/php?tab=tags
# always use the *-apache tags. It have apache to serve the thing.
FROM php:7.3.8-apache

RUN apt-get update && apt-get install -y --fix-missing \
    apt-utils \
    gnupg

RUN echo "deb http://packages.dotdeb.org jessie all" >> /etc/apt/sources.list
RUN echo "deb-src http://packages.dotdeb.org jessie all" >> /etc/apt/sources.list
RUN curl -sS --insecure https://www.dotdeb.org/dotdeb.gpg | apt-key add -

RUN apt-get update && apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    libzip-dev \
    libssl-dev libldap2-dev libicu-dev locales locales-all

WORKDIR /var/www/html

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer


# Installing required extensions for the PHP.
RUN docker-php-ext-configure intl
RUN docker-php-ext-install pdo pdo_mysql mysqli zip ldap intl

# Configuring apache and PHP (for development)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public_html
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

ENV LANG "id_ID.UTF-8"
ENV LANGUAGE "id_ID.UTF-8"
ENV LC_ALL "id_ID.UTF-8"
ENV LC_CTYPE "id_ID.UTF-8"
ENV LC_MESSAGES "id_ID.UTF-8"
RUN locale-gen "id_ID.UTF-8"
# RUN dpkg-reconfigure locales


# Add rewrite engine for APACHE
RUN a2enmod rewrite