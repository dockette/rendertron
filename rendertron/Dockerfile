FROM node:20-bookworm-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update && apt-get dist-upgrade -y && \
    apt-get install -y --no-install-recommends chromium ca-certificates && \
    rm -Rf /var/lib/apt/lists/*

ADD ./ /srv

RUN npm --prefix /srv ci && \
    npm --prefix /srv run build && \
    rm -Rf /tmp/*

WORKDIR /srv

CMD npm run start
