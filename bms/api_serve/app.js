const express = require('express')
const app = express()
const cors = require('cors')
const joi = require('@hapi/joi')
const config = require('./config')
const expressJWT = require('express-jwt')
const bodyParser = require('body-parser')
app.use(bodyParser.json()) 
// 将 cors 注册为全局中间件
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(function(req,res,next){
  res.cc = function(err,status = 1){
    res.send({
      status,
      message:err instanceof Error?err.message:err 
    })
  }
  next()
})
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
const userRouter = require('./router/user.js')
app.use('/api',userRouter)
const monileRouter = require('./router/mobile.js')
app.use('/api',monileRouter)
// 错误中间件

app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 未知错误
  res.cc(err)
})
// 错误中间件
app.use(function (err, req, res, next) {
  // 省略其它代码...
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误...
})
app.listen(3007,()=>{
  console.log('api server running at http://127.0.0.1:3007')
})
