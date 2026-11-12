FROM php:8.3-apache-bookworm

ARG APP_VERSION=1.0
ENV APP_VERSION=${APP_VERSION}

COPY --chown=www-data:www-data acceso.html contacto.html entradas.html sorteo.html estilos.css codigo.js tratarDatos.php estado.php /var/www/html/
COPY --chown=www-data:www-data docs/ /var/www/html/docs/
COPY --chown=www-data:www-data img/ /var/www/html/img/
COPY --chown=www-data:www-data ${APP_VERSION}/index.html /var/www/html/index.html

EXPOSE 80
