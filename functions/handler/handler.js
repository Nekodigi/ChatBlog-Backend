const renderHandler = require("./web/renderHandler");
const api = require("./api/api")

//Express.js setup
const express = require('express');
const bodyParser = require('body-parser');//ターゲット指定を楽にする
const line = require('./line/line');
const middlewareConfig = require('./line/const').middlewareConfig;

const app = express();

app.use(express.static('public'));//publicフォルダ内のCSSが使えるようにする。

app.get('/api', api.test)

app.get('/contents', renderHandler.contents);

app.get('/', renderHandler.contents);

app.get('/contents/:page?', renderHandler.page);

app.get('/preview/:page?', renderHandler.preview);

app.get('/approve/:page?', renderHandler.approve);

app.get('/deny/:page?', renderHandler.deny);
  
app.post('/webhook', middlewareConfig, line.eventAction);

app.use(bodyParser.json());//better to call after middleware invoke

exports.app = app;