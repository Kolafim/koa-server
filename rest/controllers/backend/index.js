/*
* @ use 管理后台文章相关接口逻辑层
*/

import { UserModel, AdminUserModel, ArticleModel, CategoryModel, TopCategoryModel  } from '../../models/index';
// import mongoose from 'mongoose';
import menu from '../config/menu';
import moment from 'moment';
// const CategoryModel = mongoose.model('Category');
// const TopCategoryModel = mongoose.model('TopCategory');

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
    let index = 0;
    let page_length = 0;
    const user = ctx.session.user;
    let { type,item,page } = ctx.query;

    if(item) index = item;
    if(!page) page = 1;
    const limit = 10;
    const skip = (page-1)*limit;
    // console.log("model :", model_arr[Index]);
    const totals = await [TopCategoryModel, CategoryModel][index].count();
    if(totals > 0) page_length = Math.ceil(totals/limit);
    const data = await [TopCategoryModel, CategoryModel][index].find().skip(skip).limit(limit).populate('cate_parent');
    const tcate = await TopCategoryModel.find();

    return ctx.render(type, {
      data,
      user,
      totals,
      type,
      tcate,
      skip,
      page,
      page_length,
      index,
      moment: require('moment'),
      model: ['TopCategory','Category'][index],
      menu:menu[type]
    });
  }

  // 文章管理
  static async article(ctx){
    let index = 0;
    let page_length = 0;
    const pageSize = 10;

    let { type,item,page } = ctx.query;
    if(item) index = item;
    if(!page) page = 1;

    const user = ctx.session.user;

    const skip = (page-1)*pageSize;
    const totals = await ArticleModel.find({}).count();
    if(totals > 0) page_length = Math.ceil(totals/pageSize);
    const list = await ArticleModel.find({}).sort({createdAt:'-1',review:'-1'}).skip(Number(skip)).limit(pageSize).populate('author',{ name:1,avatar:1,nickname:1 }).populate('comments');
    return ctx.render(type, {
      message:'文章管理',
      type,
      user,
      index,
      list,
      skip,
      page,
      totals,
      page_length,
      menu:menu[type]
    });
  }

  // 用户管理
  static async user(ctx){
    let index = 0;
    let page_length = 0;
    const pageSize = 10;

    let { type,item,page } = ctx.query;
    if(item) index = item;
    if(!page) page = 1;

    const user = ctx.session.user;

    const skip = (page-1)*pageSize;
    const totals = await [AdminUserModel,AdminUserModel,UserModel][index].count();
    if(totals > 0) page_length = Math.ceil(totals/pageSize);
    const data = await [AdminUserModel,AdminUserModel,UserModel][index].find({},{password:0}).sort({createdAt:'-1'}).skip(Number(skip)).limit(pageSize);
    return ctx.render(type, {
      message:'用户管理',
      type,
      user,
      totals,
      page_length,
      index,
      page,
      skip,
      data,
      menu:menu[type]
    });
  }

}

export default BackendMain;
