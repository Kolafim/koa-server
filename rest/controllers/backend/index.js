/*
* @ use 管理后台文章相关接口逻辑层
*/

import { UserModel, AdminUserModel } from '../../models/index';
import mongoose from 'mongoose';
import menu from '../config/menu';
import moment from 'moment';
const CategoryModel = mongoose.model('Category');
const TopCategoryModel = mongoose.model('TopCategory');

class BackendMain {

  // 登录页渲染
  static async Index(ctx) {
    console.log('seesion.user:', ctx.session.user);
    if(ctx.session.user && ctx.session.user.name) return ctx.redirect('/server/home');
    return ctx.render('login', { message:'登录'});
  }

  // 首页渲染
  static async home(ctx) {
    // console.log('flash:',ctx.flash);
    const user = ctx.session.user;
    const type = 'home';
    return ctx.render(type, { message:'Home',type ,user });
  }

  // 分类管理
  static async category(ctx){
    let model_arr = ['TopCategory','Category'];
    let index = 0;
    let current = 1;
    const user = ctx.session.user;
    const { type,item,page } = ctx.query;

    if(item) index = item;
    if(page) current = page;
    const limit = 6;
    const skip = (Number(current)-1)*limit;
    // console.log("model :", model_arr[Index]);
    const count = await mongoose.model(model_arr[index]).count();
    const data = await mongoose.model(model_arr[index]).find().skip(skip).limit(limit).populate('cate_parent');
    const tcate = await TopCategoryModel.find();

    return ctx.render(type, {
      data,
      user,
      count,
      type,
      tcate,
      current,
      index,
      moment: require('moment'),
      path: 'categorys/'+model_arr[index],
      menu:menu[type]
    });
  }

  // 文章管理
  static async article(ctx){
    let index = 0;
    const { type,item } = ctx.query;
    if(item) index = item;
    const user = ctx.session.user;
    return ctx.render(type, {
      message:'文章管理',
      type,
      user,
      index,
      menu:menu[type]
    });
  }

  // 用户管理
  static async user(ctx){
    let index = 0;
    const { type,item } = ctx.query;
    if(item) index = item;
    const user = ctx.session.user;
    const data = await AdminUserModel.find({},{password:0});
    return ctx.render(type, {
      message:'用户管理',
      type,
      user,
      index,
      data,
      menu:menu[type]
    });
  }

}

export default BackendMain;
