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