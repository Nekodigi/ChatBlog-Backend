const renderHandler = require("./web/renderHandler");
const api = require("./api/api")


//Express.js setup
const express = require('express');
const bodyParser = require('body-parser');//ターゲット指定を楽にする
const cors = require('cors');//https://zenn.dev/luvmini511/articles/d8b2322e95ff40
const line = require('./line/line');
const middlewareConfig = require('./line/const').middlewareConfig;

const app = express();

app.use(express.static('public'));//publicフォルダ内のCSSが使えるようにする。
app.use(cors());

app.get('/api', api.test)

app.get('/api/archive', api.archive);
app.get('/api/archive/monthly/:YYMM', api.monthly_archive);
app.get('/api/variable/monthly', api.monthly_count);
app.get('/api/post', api.all_posts_path);
app.get('/api/post/:id?', api.post);
app.get('/api/preview/:id?', api.preview);

app.post('/api/approve/:id?', api.approve);
app.post('/api/deny/:id?', api.deny);
app.post('/api/apply', api.apply);
  
app.post('/webhook', middlewareConfig, line.eventAction);

app.use(bodyParser.json());//better to call after middleware invoke


exports.app = app;