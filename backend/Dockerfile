FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 4000

# USER node
CMD [ "sh", "./start.sh" ]