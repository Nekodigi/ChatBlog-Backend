const admin = require("../firebase/firebase").admin;
const projectBucket = require("../firebase/firebase").projectBucket;

const storage = admin.storage();
const bucket = storage.bucket(projectBucket());

exports.upload = async (data, path) => {//upload from memory
    await bucket.file(path).save(data);
}

exports.uploadFile = (filePath, path) => {//upload
    bucket.upload(filePath, {destination:path});
}

exports.delete = (path) => {
    bucket.file(path).delete();
}