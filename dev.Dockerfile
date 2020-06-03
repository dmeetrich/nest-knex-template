FROM node:12

RUN apt-get install curl bash

WORKDIR /app

COPY wait-for.sh /bin/wait-for
RUN chmod a+x /bin/wait-for

CMD npm run knex migrate:latest
