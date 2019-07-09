FROM node:12-slim

RUN apt update && apt dist-upgrade -y && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get -y install google-chrome-stable

ADD /rendertron/ /srv

RUN npm --prefix /srv install && \
    npm --prefix /srv run build && \
    rm -Rf /tmp/* && \
    rm -Rf /var/lib/apt/lists/*

WORKDIR /srv

CMD npm run start
