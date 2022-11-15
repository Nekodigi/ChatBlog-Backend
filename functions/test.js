const firebaseStorage = require("./infrastructure/firebaseStorage/firebaseStorage")
const API_KEY = require("./secret/FirebaseConfig.json").API_KEY;

const { deploy} = require("./secret/GithubConfig.json");
const { workflowDispatch } = require("./infrastructure/github/github");

workflowDispatch(deploy);
