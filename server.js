const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const res = require('express/lib/response');
const mysql = require('mysql');
const { json } = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "finalweb"
})

con.connect(err => {
  if(err) throw(err);
  else{
      console.log("MySQL connected");
  }
})

const queryDB = (sql) => {
  return new Promise((resolve,reject) => {
      // query method
      con.query(sql, (err,result, fields) => {
          if (err) reject(err);
          else
              resolve(result)
      })
  })
}

app.post('/register', async (req,res) => {
  return res.redirect('register.html');
})

app.post('/regisDB', async (req,res) => {
  let sql = "CREATE TABLE IF NOT EXISTS userinfo (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255),password VARCHAR(100),getlike INT,getscore INT,comment JSON)";
  let result = await queryDB(sql);

  const newUser = req.body;
  const username = newUser.username;
  const password = newUser.password[0];
  let comment = ['hi', 'yo']
  let commentJson = JSON.stringify(comment);

  sql = `SELECT username FROM ${tablename}`;
  result = await queryDB(sql);
  result = Object.assign({},result);
  let obj = Object.keys(result);
  for(var i = 0 ; i < obj.length ; i++){
    var temp = result[obj[i]];
    var dataUsername = temp.username;
    if(dataUsername == username ){
      return res.redirect('register.html?error=1');
    }
}

      
  if(password == newUser.password[1]){
    sql = `INSERT INTO userinfo (username, password,getlike,getscore,comment) VALUES ("${username}", "${password}",0,0,'${commentJson}')`;
    result = await queryDB(sql);
    
    return res.redirect('login.html');
  }else{
      return res.redirect('register.html?error=1');
  }
  
})

app.get('/logout', (req,res) => {
  res.clearCookie('username');
  res.clearCookie('highscore');
  return res.redirect('login.html');
})

app.get('/sendToStart', (req,res) => {
  return res.redirect('game.html');
})

app.get('/sendToScore', (req,res) => {
  return res.redirect('score.html');
})

app.get('/sendToMenu', (req,res) => {
  return res.redirect('index.html');
})

let tablename = "userinfo";
//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
  let sql = `SELECT id, username, password FROM ${tablename}`;
  let result = await queryDB(sql);
  result = Object.assign({},result);
  const username = req.body.username;
  const password = req.body.password;

  let obj = Object.keys(result);

  var isCorrect = false;
    for(var i = 0 ; i < obj.length ; i++){
        var temp = result[obj[i]];
        var dataUsername = temp.username;
        var dataPassword = temp.password;
        if(dataUsername == username && dataPassword == password ){
            isCorrect = true;
            res.cookie('username', username);
        }
    }

    if(isCorrect == true){
      setTimeout(function(){return res.redirect('index.html');}, 300);
    }
    else{
      return res.redirect('login.html?error=1');
    }
})


app.post('/saveScore',async (req,res) => {
  const newScore = req.body

  let sql = `UPDATE userinfo 
  SET getscore = '${newScore.score}' 
  WHERE username = '${newScore.user}'`;
  result = await queryDB(sql);
})

app.get('/readScoreDB',async (req,res) => {
  let sql = `SELECT username,getlike,getscore FROM ${tablename}`;
  let result = await queryDB(sql);
  result = Object.assign({},result);
  let resultJson = JSON.stringify(result);
  res.json(resultJson)
})

app.post('/writeLikeScore',async (req,res) => {
  const newScore = req.body
  let sql = `UPDATE userinfo 
  SET getlike = '${newScore.like}' 
  WHERE username = '${newScore.user}'`;
  result = await queryDB(sql);
  res.send({succes:true});
})



app.post('/comment',async (req,res) => {
  const username = req.body.user;
  res.cookie('highscore', username);
  return res.redirect('comment.html');
})
app.get('/sendToComment', (req,res) => {
  return res.redirect('comment.html');
})

app.post('/loadScoreComment',async (req,res) => {
  let sql = `SELECT username, getscore, comment FROM ${tablename}`;
  let result = await queryDB(sql);
  result = Object.assign({},result);
  let obj = Object.keys(result);
  
  var highscoreUsername = req.body.user;

  for(var i = 0 ; i < obj.length ; i++){
      var temp = result[obj[i]];
      var dataUsername = temp.username;
      var dataScore = temp.getscore;
      if(dataUsername == highscoreUsername){
        console.log(temp)
        let sendScoreJson = JSON.stringify(temp);
        return res.json(sendScoreJson);
      }
  }
})

app.get('/readPost', async (req,res) => {

  let sql = `SELECT username, comment FROM ${tablename}`;
  let result = await queryDB(sql);
  result = Object.assign({},result);
  let obj = Object.keys(result);
  
  var highscoreUsername = req.body.user;

  for(var i = 0 ; i < obj.length ; i++){
      var temp = result[obj[i]];
      var dataUsername = temp.username;
      var dataComment = temp.comment;      
      if(dataUsername == highscoreUsername){
        let sendCommentJson = JSON.stringify(dataComment);
        console.log(sendCommentJson)
        return res.json(sendCommentJson);
      }
  }
})

app.post('/writePost',async (req,res) => {
  let sql = `SELECT username, comment FROM ${tablename}`;
  let result = await queryDB(sql);
  result = Object.assign({},result);
  let obj = Object.keys(result);
  
  const newMsg = req.body.message
  var highscoreUsername = req.body.highscoreUser

  for(var i = 0 ; i < obj.length ; i++){
      var temp = result[obj[i]];
      var dataUsername = temp.username;
      var dataComment = temp.comment;      
      if(dataUsername == highscoreUsername){
        let newDataComment = JSON.parse(dataComment)
        newDataComment.push(newMsg);
        var newJsonData = JSON.stringify(newDataComment);
        let sql = `UPDATE userinfo 
        SET comment = '${newJsonData}' 
        WHERE username = '${dataUsername}'`;
        result = await queryDB(sql);
        return res.json(result);
      }
  }
})

app.listen(port, hostname, () => {
  console.log(`Server running at   http://${hostname}:${port}/login.html`);
});
