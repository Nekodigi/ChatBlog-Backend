const line = require('@line/bot-sdk');
const config = require('../../secret/LineConfig.json');

const client = new line.Client(config);
module.exports.client = client;

exports.middlewareConfig = line.middleware(config);