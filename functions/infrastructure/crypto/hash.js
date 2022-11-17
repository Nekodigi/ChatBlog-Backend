const crypto = require("crypto");
const { API_KEY } = require("../../secret/FirebaseConfig.json");
exports.getHash = (value) => {
    return crypto.createHash('md5').update(API_KEY+value).digest('hex');
}