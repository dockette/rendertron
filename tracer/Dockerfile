FROM php:7.4-cli-alpine

LABEL maintainer="Milan Sulc <sulcmil@gmail.com>"

ADD .docker/php.ini /usr/local/etc/php/conf.d/999-tracer.ini

ENV TZ=Europe/Prague

RUN apk --no-cache add \
        bash \
        git \
        ca-certificates \
        curl \
        openssh \
        tzdata \
        tini && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer && \
    rm -rf /var/cache/apk/*

WORKDIR /srv
ADD ./ /srv

RUN mkdir -p /srv/var && \
    composer install --no-dev --no-interaction --prefer-dist

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/local/bin/php", "/srv/bin/tracer.php"]
