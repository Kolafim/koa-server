/*
* @ use 管理后台文章相关接口逻辑层
*/

import { UserModel, CategoryModel, TopCategoryModel } from '../../models/index';
import mongoose from 'mongoose';
//const UserModel = mongoose.model('User');
// const CategoryModel = mongoose.model('Category');
// const TopCategoryModel = mongoose.model('TopCategory');

class BackendArticle {

  // 创建一级分类
  static async create_tcate(ctx) {
    const data = ctx.request.body;
    const tcate_name = data.tcate_name;
    // if(!data||!tcate_name) return ctx.render('error',{
    //      message: '信息错误!',
    //      error: { status:404 }
    // })
    if(!data||!tcate_name) return ctx.error({msg:'信息错误!',status:404})
    const isexit = await TopCategoryModel.findOne({ tcate_name });
    // if(isexit) return ctx.render('error',{
    //   message: '该分类已存在!',
    //   error: { status:500 }
    // })
    if(isexit) return ctx.error({msg:'该分类已存在!',status:400})
    const result = await TopCategoryModel.create(data);
    // ctx.redirect('back');
    if(result) return ctx.success({msg:'创建成功'})
    else return ctx.error({msg:'创建时出错',status:400})
  }

  // 创建二级分类
  static async create_acate(ctx) {
    const data = ctx.request.body;
    const cate_name = data.cate_name;
    // if(!data||!cate_name) return ctx.render('error',{
    //      message: '信息错误!',
    //      error: { status:404 }
    // })
    if(!data||!tcate_name) return ctx.error({msg:'信息错误!',status:404})
    const isexit = await CategoryModel.findOne({ cate_name });
    // if(isexit) return ctx.render('error',{
    //      message: '该分类已存在!',
    //      error: { status:500 }
    // })
    if(isexit) return ctx.error({msg:'该分类已存在!',status:400})
    const result = await CategoryModel.create(data);
    // ctx.redirect('back');
    if(result) return ctx.success({msg:'创建成功'})
    else return ctx.error({msg:'创建时出错',status:400})
  }

  // 编辑一级分类
  static async put_tcate(ctx){
    const { id,tcate_name } = ctx.request.body;
    // if(!id || !tcate_name) ctx.render('error',{
    //    message: '不能为空!',
    //    error: { status:500 }
    // })
    if(!id || !tcate_name) return ctx.error({msg:'不能为空!',status:404})
    const result = await TopCategoryModel.findByIdAndUpdate(id,{tcate_name});
    // ctx.redirect('back');
    if(result) return ctx.success({msg:'编辑成功'})
    else return ctx.error({msg:'编辑时出错',status:400})
  }

  // 编辑二级分类
  static async put_acate(ctx){
    const { cateid,cate_name,cate_info,cate_parent } = ctx.request.body;
    // if(!cateid || !cate_name || !cate_info || !cate_parent) ctx.render('error',{
    //    message: '信息错误!',
    //    error: { status:404 }
    // })
    if(!cateid || !cate_name || !cate_info || !cate_parent) return ctx.error({msg:'不能为空!',status:404})
    const result = await CategoryModel.findByIdAndUpdate(cateid,{cate_name,cate_info,cate_parent});
    // ctx.redirect('back');
    if(result) return ctx.success({msg:'编辑成功'})
    else return ctx.error({msg:'编辑时出错',status:400})
  }

  // 删除分类
  static async delete_cate(ctx){
    let { model,type,id } = ctx.method=='GET'?ctx.query:ctx.request.body;
    if(!id && ctx.params.id) id = ctx.params.id;

    console.log({model,type,id});

    // if(!id || !model) return ctx.render('error',{
    //   message: '参数错误!',
    //   error: { status:400 }
    // })
    if(!id || !model) return ctx.error({msg:'不能为空!',status:404, data:ctx.request.body})
    const result = await mongoose.model(model).findByIdAndRemove(id);
    // ctx.redirect('back');
    if(result) return ctx.success({msg:'删除成功'})
    else return ctx.error({msg:'删除时出错',status:400})
  }

}

export default BackendArticle;
