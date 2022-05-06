const joi = require('@hapi/joi');
// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
const byid = joi.number().integer().min(1).required()
  // 注册和登录表单的验证规则对象
exports.reg_login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
  },
}
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email
  }
}

exports.delete_userinfo = {
  body:{
    byid
  }
}