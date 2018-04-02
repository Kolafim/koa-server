const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const session = require('koa-session');
const db = require('./rest/models/db');
const koaBody = require('koa-body');

const { backendRouter, frontendRouter } = require('./rest/index');
onerror(app);

process.THEME_LIST = ['theme-1','theme-2']
process.global = {
  server_name : 'sinn管理',
  theme:1//主题下标
}

// cookies
app.keys = ['sinn:secret'];
const CONFIG = {
  key: 'sinn',
  maxAge: 604800000,  // 7天
  overwrite: true,
  signed: true,
};

app.use(convert(logger()))
   .use(convert(session(CONFIG,app)))
   .use(require('koa-static')(__dirname + '/public'));

app.use(koaBody({
  formLimit: 1048576,  // 最大1M
  textLimit: 1048576,
  formidable:{
    keepExtensions: true, // 带拓展名上传，否则上传的会是二进制文件而不是图片文件
    onFileBegin(name,file){
      file.path = __dirname+'/public/images/'+file.name; // 重命名上传文件
    },
    uploadDir: __dirname+'/public/images'},  // 输出到images文件夹
  multipart:true,
}))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// router
app.use(require('./rest/middlewares/response'));
app.use(require('./rest/middlewares/filter'));
app.use(backendRouter.routes())
	 .use(backendRouter.allowedMethods())
	 .use(frontendRouter.routes())
	 .use(frontendRouter.allowedMethods());

// response
app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx);
  ctx.render('error', { message: ' 服务器错误!',error: err });
});

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

module.exports = app;
