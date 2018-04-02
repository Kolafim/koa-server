From registry.cn-hangzhou.aliyuncs.com/kolafim/node:7.5

COPY ./ /koa-server
WORKDIR /koa-server
RUN npm install

EXPOSE 8080

ENTRYPOINT ["node","bin/run"]
