const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: false }))
const db = require('../db/index.js')
const cors = require('cors')
app.use(cors())
exports.tableData = function(req,res){
  const sql = `select * from tabledata`
  db.query(sql,(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.lenght<0){
      return res.cc('查询本月手机销量数据失败！')
    }
    res.send({message:'查询数据成功！', status:0,data :results})
  })
}

exports.countdata = function(req,res){
  const sql = `select * from countdata`
  db.query(sql,(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.lenght<0){
      return res.cc('查询本月手机销量数据失败！')
    }
    res.send({message:'查询数据成功！', status:0,data :results})
  })
}

exports.oddata = function(req,res){
 var ordername = 'orderData'
 var orderData = []
 var videoname = 'videoData'
 var videoData = []
 var tablename = 'tableData'
 var tableData = []
 var username = 'userData'
 var userdata = []
 var data = {}
  const sql1 = `SELECT * FROM  mdorder`
  db.query(sql1,(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.lenght<0){
      return res.cc('查询本月手机销量数据失败！')
    }
    remove(results,'id')
    orderData = results
    data[ordername] = orderData
  })
  const sql2 = `SELECT * FROM  videodata`
  db.query(sql2,(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.lenght<0){
      return res.cc('查询本月手机销量数据失败！')
    }
    remove(results,'id')
    videoData = results
    data[videoname] = videoData;
  })
  const sql3 = `SELECT * FROM  tabledata`
  db.query(sql3,(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.lenght<0){
      return res.cc('查询本月手机销量数据失败！')
    }
    remove(results,'id')
    tableData = results
    data[tablename] = tableData;
  })
  const sql4 = `SELECT * FROM userdata`
  db.query(sql4,(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.lenght<0){
      return res.cc('查询本月手机销量数据失败！')
    }
    remove(results,'iduser')
    userdata = results
    data[username] = userdata;
    res.send({
      message:'统计图查询数据成功',
      status:0,
      data:data
    })
  }) 
}

exports.editinsert = function(req,res){
  const data = req.body
const sql = `select * from usertable where name=? and addr=?`
db.query(sql, [data.name,data.addr], function (err, results) {
  // 执行 SQL 语句失败
  if (err) {
    return res.send({ status: 1, message: err.message })
  }
  // 用户名被占用
  if (results.length > 0) {
    return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
  }
  const sql = `insert into usertable set ?`
  db.query(sql,data,(err,result)=>{
    if(err) return res.cc(err.message)
    if(result.affectedRows === 1){
      res.send({
        message:'数据添加成功',
        status:0
      })
    }
  })
})
}

exports.accountApi = function(req,res){
  let { pageSize, currentPage } = req.query;
  // 默认值
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 1;
 
  // 构造sql语句 （查询所有数据 按照时间排序）
  let sqlStr = `select * from usertable`;
  // 执行sql语句
  db.query(sqlStr, (err, data) => {
    if (err) return res.cc(err)
    
    // 计算数据总条数
    let total = data.length;
    // 分页条件 (跳过多少条)
    let n = (currentPage - 1) * pageSize;
    // 拼接分页的sql语句
    sqlStr += ` limit ${n}, ${pageSize}`;
    // 执行sql语句 （查询对应页码的数据）
    db.query(sqlStr, (err, data) => {
      if (err) return res.cc(err)
      console.log(total);
      // 把数据返回给前端 两个数据 数据总条数 total 和 对应页码的数据 data
      res.send({
        total,
        data
      });
    });
  });
}

exports.nameApi = function(req,res){
  const data = req.query
  const sql = `select * from usertable where name=?`
  db.query(sql,[data.name],(err,results)=>{
    if(err)  return res.cc(err.message)
    if (results.lenght<0){
      return res.cc('查询失败')
    }
    res.send({
      message:'查询成功',
      status:0,
      data:results
    })
  })

} 

exports.deleteUserApi = function(req,res){
  const data = req.query
  
  const sql = `select * from usertable where id=?`
db.query(sql,[data.id],(err,result)=>{
  if(err) return res.cc(err.message)
  if(result.lenght < 0){
    return res.cc('需要删除的用户不存在')
  }
  const sql = `delete from usertable where id=?`
  db.query(sql,[data.id],(err,result)=>{
   
    if(err) return res.cc(err.message)
    if(result.affectedRows !== 1){
      return res.cc('删除用户失败')
    }
     res.send({
       message:'删除用户成功',
       status:0
       })
      })
    })
  }

exports.updataUserApi = function(req,res){
  const data = req.body.data
  const results = data.operateForm
  console.log(results);
  const sql = `select * from usertable where id=?`
  db.query(sql,[data.id],(err,result)=>{
    if(err) return res.cc(err.message)
    if(result.lenght < 0){
      return res.cc('需要编辑的用户不存在')
    }
    const sql = `update usertable ? where id=?`
    db.query(sql, [results, data.id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // 执行 SQL 语句成功，但影响行数不为 1
      if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
      // 修改用户信息成功
      return res.cc('修改用户基本信息成功！', 0)
    })
   })
}

exports.goodsApi = function(req,res){
  const sql = `select * from commoditylist`
  console.log('111111111');
  db.query(sql,(err,results)=>{
    if(err) return res.cc(err.message)
    if(results.lenght<0){
      return res.cc('查询本月手机商品信息失败！')
    }
    res.send({
      message:'查询本月手机商品信息！',
      status:0,
      data:results
    })
  }) 
}

function remove(arr,id){
  arr.forEach(item => {
    Reflect.deleteProperty(item,id) 
  });
}