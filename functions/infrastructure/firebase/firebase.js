'use strict';

const admin = require("firebase-admin");
const serviceAccount = require("../../secret/ServiceAccount.json");
const projectID = require("../../secret/FirebaseConfig.json").projectID;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

module.exports.admin = admin;

exports.projectBucket = () => {
  return "gs://"+projectID+".appspot.com/";
}

exports.projectDomain = () => {
  return projectID + ".appspot.com";
}

exports.projectURL = () => {
  return "https://" + projectID + ".web.app";
}

exports.URLtoPostID = (url) => {
  let splitUrl = url.split("/");
  let id = splitUrl[splitUrl.length-1].substring(0,8);
  id = url.split("?id=")[1] ? url.split("?id=")[1].substring(0, 8) : id;
  id = url.split("&id=")[1] ? url.split("&id=")[1].substring(0, 8) : id;
  return id;
}