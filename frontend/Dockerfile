FROM node:20-alpine

WORKDIR /app

# RUN npm install -g yarn

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]