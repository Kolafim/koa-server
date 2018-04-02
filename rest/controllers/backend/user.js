/*
* @ use 管理后台文章相关接口逻辑层
*/

// import mongoose from 'mongoose';
import md5 from 'md5';
import Adminconfig from '../../../config/admin';
import { UserModel, AdminUserModel } from '../../models/index';
// const AdminUserModel = mongoose.model('AdminUser');
// const CategoryModel = mongoose.model('Category');
// const TopCategoryModel = mongoose.model('TopCategory');

class BackendUser {

  // 添加管理员
  static async create_user(ctx){
   const { name, nickname, password } = ctx.request.body;
   if(!name||!password) return ctx.error({
      msg: '用户或密码不能为空!',
      status:400
    })
   const isexit = await AdminUserModel.findOne({name,password: md5(password)});
   if(isexit) return ctx.error({
      msg: '该用户已存在!',
      status:400
   })
   const result = await AdminUserModel.create({name,nickname,password: md5(password)});
   // console.log("result:",result);
   // ctx.redirect('/');
   if(result) return ctx.success({msg:'创建成功'})
   else return ctx.error({msg:'创建时出错',status:400})
  }

  // 后台用户登录
  static async signIn(ctx) {
    const { name, password } = ctx.request.body;
    // console.log(ctx);
    console.log('signIn:', ctx.request.body);
    if(!name||!password) return ctx.error({
      msg: '信息填写错误!',
      status:400
    })
    if(name == Adminconfig.name && md5(password)==Adminconfig.password){
      console.log('后台登录成功');
      ctx.session.user = { name, password };
      // ctx.redirect('/server/home');
      return ctx.success({msg:'登录成功'});
    }else{
      const result = await AdminUserModel.findOne({name,password: md5(password)});
      if(result) {
        console.log('后台登录成功');
        ctx.session.user = result;
        return ctx.success({msg:'登录成功'});
      }else{
        return ctx.error({
          status:400,
          msg:'用户或密码错误!'
        })
      }
    }
    // ctx.redirect('/server/home');
  }

  // 后台用户退出
  static async signOut(ctx) {
    ctx.session.user = null;
    return ctx.redirect('/');
    // return ctx.render('login', {});
  }

}

export default BackendUser;
