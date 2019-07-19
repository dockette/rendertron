FROM dockette/alpine:3.9

MAINTAINER Milan Sulc <sulcmil@gmail.com>

ADD https://dl.bintray.com/php-alpine/key/php-alpine.rsa.pub /etc/apk/keys/php-alpine.rsa.pub
ADD .docker/php.ini /etc/php7/conf.d/999-tracer.ini

ENV TZ=Europe/Prague

RUN echo '@community http://nl.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories && \
    echo "@php https://dl.bintray.com/php-alpine/v3.9/php-7.3" >> /etc/apk/repositories && \
    # DEPENDENCIES #############################################################
    apk update && \
    apk upgrade && \
    apk --no-cache add \
        bash \
        git \
        ca-certificates \
        curl \
        openssh \
        tzdata \
        tini && \
    # PHP ######################################################################
    apk --no-cache add \
        php7@php \
        php7-ctype@php \
        php7-curl@php \
        php7-iconv@php \
        php7-intl@php \
        php7-json@php \
        php7-mbstring@php \
        php7-openssl@php \
        php7-session@php \
        php7-phar@php \
        php7-xml@php \
        php7-zip@php \
        php7-zlib@php && \
        ln -s /usr/bin/php7 /usr/bin/php && \
    # COMPOSER #################################################################
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer && \
    composer global require "hirak/prestissimo:^0.3" && \
    # CLEAN UP #################################################################
    rm -rf /var/cache/apk/*

WORKDIR /srv
ADD ./ /srv

RUN mkdir -p /srv/var && \
    composer install --no-suggest --prefer-dist

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/bin/php", "/srv/bin/tracer.php"]
