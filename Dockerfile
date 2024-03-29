# Docker多阶段构建

### DEV环境 ###
FROM node:18.7.0 AS development

# 定位到容器工作目录
WORKDIR /usr/src/app
# 拷贝package.json
COPY package*.json ./

RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build

### PROD环境 ###
FROM node:18.7.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
