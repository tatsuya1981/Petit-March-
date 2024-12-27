FROM node:20-slim

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

RUN yarn add multer
RUN yarn add -D @types/multer

COPY . .

RUN npx prisma generate

RUN yarn build

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 4000

# USER node
CMD [ "sh", "./start.sh" ]