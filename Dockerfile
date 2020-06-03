FROM node:12

RUN apt-get install curl bash git

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

COPY wait-for.sh /bin/wait-for
RUN chmod a+x /bin/wait-for

COPY run_and_notify.sh /bin/run_and_notify
RUN chmod a+x /bin/run_and_notify

CMD npm run start:prod
