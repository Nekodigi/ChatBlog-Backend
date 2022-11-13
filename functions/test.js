const firebaseStorage = require("./infrastructure/firebaseStorage/firebaseStorage")
const API_KEY = require("./secret/FirebaseConfig.json").API_KEY;

const crypto = require('crypto');

console.log(crypto.createHash('md5').update(API_KEY+"221112mc").digest('hex'));