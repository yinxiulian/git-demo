const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
exports.regUser = (req,res)=>{
  const userinfo = req.body.data.ruleForm
  const sql = `select * from users where username=?`
  if( userinfo.username !=='' && userinfo.password !== ''){
  db.query(sql,[userinfo.username],(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.length>0){
      return res.cc('用户名被占用，请更换其他用户名！' )
    }
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    const sql = `insert into users set ?`
    db.query(sql,{username:userinfo.username,password:userinfo.password,status:userinfo.status},(err,results)=>{
      if(err) return res.cc(err.message)
      if(results.affectedRows !== 1){
        return res.cc('用户注册失败！,请稍后再试' )
      }
      res.send({
        status: 0,
        message: '注册成功！'
      })
    })
  })
}
else{
  res.send({
    status: 1,
    message: '账号密码不能为空！'
  })
}}


exports.login = function(req,res){
const userinfo = req.body.data.ruleForm
console.log(userinfo);
const sql = `select * from users where username=?`
db.query(sql,[userinfo.username],(err,results)=>{
  if(err) return res.cc(err.message)
  if( results.length == 0 ){
   return res.cc('用户账号不存在，请重新输入正确的账号！')
  }
  console.log(results[0].password);
  const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
  console.log(compareResult);
  if(!compareResult){
    return res.cc('用户密码错误，请重新输入正确的密码')
  }
  const user = {...results[0],password:'' }
  // 生成 Token 字符串
  const tokenStr = jwt.sign(user, config.jwtSecretKey, {
  expiresIn: '10h', // token 有效期为 10 个小时
})
res.send({
  status: 0,
  message: '登录成功！',
  // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
  token: 'Bearer ' + tokenStr,
})
})
}





