FROM node:20

RUN apt-get update && \
    apt-get install -y shfmt

WORKDIR /app
COPY ./shfmt-online/ /app
RUN npm install && npm run build

CMD ["npm", "run", "start"]