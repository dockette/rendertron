FROM node:15-slim

RUN apt update && apt dist-upgrade -y && \
	apt install -y wget gnupg2 && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get -y install google-chrome-stable libxss1

ADD ./ /srv

RUN npm --prefix /srv install && \
    npm --prefix /srv run build && \
    rm -Rf /tmp/* && \
    rm -Rf /var/lib/apt/lists/*

WORKDIR /srv

CMD npm run start
