/*
* @ use 管理后台的接口配置
* @ 逻辑层实现 /controllers/backend/*
*/

import { BackendMain,BackendArticle,BackendUser } from '../controllers/backend.export';
const router = require('koa-router')();

const CHECK_ADMIN = async (ctx,next)=>{
  //验证是否登录
  if(!ctx.session.user) return ctx.redirect('/');
  await next();
}

router
  .get('/', BackendMain.Index)                                                 // 管理后台首页

  // 用户相关
  .post('/server/login', BackendUser.signIn)                                   // 用户登录验证接口
  .post('/server/user/create_user', BackendUser.create_user)                   // 添加管理员
  .get('/server/signout', BackendUser.signOut)                                 // 退出登录
  .get('/server/user', CHECK_ADMIN, BackendMain.user)                          // 用户管理主页

  // 文章相关
  .get('/server/home', CHECK_ADMIN, BackendMain.home)                          // 管理后台主页
  .get('/server/category', CHECK_ADMIN, BackendMain.category)                  // 分类管理主页
  .get('/server/article', CHECK_ADMIN, BackendMain.article)                    // 文章管理主页
  .post('/server/article/create_tcate', BackendArticle.create_tcate)           // 创建一级分类
  .post('/server/article/create_acate', BackendArticle.create_acate)           // 创建二级分类
  .post('/server/article/put_tcate', BackendArticle.put_tcate)                 // 编辑一级分类
  .post('/server/article/put_acate', BackendArticle.put_acate)                 // 编辑二级分类
  .get('/server/article/delete_cate/:id', BackendArticle.delete_cate);         // 删除分类


module.exports = router;
