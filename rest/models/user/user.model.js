/*
* @ use 用户schema
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true }, // 用户名
  nickname: { type: String, required: true }, // 昵称
  email: { type: String, default: '' },
  avatar: { type: String,default:'' },    // 头像
  profile: { type: String,default:'' },   // 个人简介
  isadmin: {type:Number,default:0},       //是否为管理员
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('User', UserSchema);
