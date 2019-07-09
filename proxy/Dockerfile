FROM alpine:3.10

ENV NGINX_PROXY=0.0.0.0:3000

RUN apk update && \
    apk upgrade && \
    apk add --no-cache nginx gettext

ADD ./nginx/nginx.conf /etc/nginx/
ADD ./nginx/mime.types /etc/nginx/
ADD ./nginx/default.tpl /etc/nginx/conf.d/

RUN mkdir -p /data && chmod 0775 /data

CMD envsubst \$NGINX_PROXY, < /etc/nginx/conf.d/default.tpl > /etc/nginx/conf.d/default.conf && \
    nginx -g "daemon off;"
