
const firestore = require("../../infrastructure/firestore/firestore");
const postsData = require("./data/posts");
const postData = require("./data/post");
const previewData = require("./data/preview");
const status = require("../../structure/const/status");


exports.contents = async (req, res) => {
  var json = await postsData.getJson(req.query.next, req.query.previous, req.query.start, req.query.end, 20, req.query.statusMessage);
  if(json == undefined || json["posts"] == undefined){res.writeHead(302, {'Location': '/404.html'});res.end();}
  res.render("contents.ejs", json);
}

exports.page = async (req, res) => {//HOW TO ADVANCED NEXT w
  var json = await postData.getJson(req.params.page);
  if(json == undefined || json["currentData"] == undefined){res.writeHead(302, {'Location': '/404.html'});res.end();}
  res.render("post.ejs", json);
}

exports.preview = async (req, res) => {//HOW TO ADVANCED NEXT w
  var json = await previewData.getJson(req.params.page);
  if(json == undefined || json["currentData"] == undefined){res.writeHead(302, {'Location': '/404.html'});res.end();}
  res.render("preview.ejs", json);
}

exports.approve = async (req, res) => {//HOW TO ADVANCED NEXT w
  var preview = (await firestore.getDocument("preview", req.params.page)).data();
  
  //increment only not approve to approve
  if(preview["status"] !== status.approved)firestore.incrementField("variable", "postPerMonth", preview["id"].substring(0, 4), 1);
  preview["status"] = status.approved;
  firestore.setDocument("preview", preview["id"], preview);
  var content = {...preview};
  content["status"] = "";
  firestore.setDocument("contents", content["id"], content);

  var json = await previewData.getJson(req.params.page);
  json.currentData["status"] = status.approved;//for instant display
  if(json == undefined || json["currentData"] == undefined){res.writeHead(302, {'Location': '/404.html'});res.end();}
  res.render("preview.ejs", json);
}

exports.deny = async (req, res) => {//HOW TO ADVANCED NEXT w
  var preview = (await firestore.getDocument("preview", req.params.page)).data();

  //decrement when approve to deny
  if(preview["status"] === status.approved)firestore.incrementField("variable", "postPerMonth", preview["id"].substring(0, 4), -1);

  preview["status"] = status.denied;
  firestore.setDocument("preview", preview["id"], preview);
  firestore.deleteDocument("contents", preview["id"]);

  var json = await previewData.getJson(req.params.page);
  json.currentData["status"] = status.denied;//for instant display
  if(json == undefined || json["currentData"] == undefined){res.writeHead(302, {'Location': '/404.html'});res.end();}
  res.render("preview.ejs", json);
}