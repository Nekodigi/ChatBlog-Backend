const sharp = require("sharp");

const { admin, projectBucket }  = require("../firebase/firebase");
const firebase = require("../firebase/firebase");
const date = require('date-and-time');//npm install date-and-time https://www.geeksforgeeks.org/node-js-date-format-api/
const { randomChar } = require("../../util/random");

const storage = admin.storage();
module.exports.storage = storage;
const bucket = storage.bucket(projectBucket());
module.exports.bucket = bucket;

const upload = async (data, path) => {//upload from memory
    await bucket.file(path).save(data);
}
exports.upload = upload;

exports.uploadFile = (filePath, path) => {//upload
    bucket.upload(filePath, {destination:path});
}

exports.deleteAll = (paths) => {
    paths.forEach(path => {delete_(path)})
}

const delete_ = (path) => {
    bucket.file(path).delete();
}
exports.delete_ = delete_;

exports.getUrl = (path) => {
    bucket.file(path).makePublic();
    return bucket.file(path).publicUrl();
}

exports.uploadResizedImage = async (image, size, dir) => {
    image = await sharp(image).resize({width:size, height:size, fit: sharp.fit.inside}).toBuffer();
    var now = new Date();
    const path = dir+"/"+date.format(now,'YYMM')+"/"+date.format(now, 'DD')+randomChar(2)+".png";
    await upload(image, path);
    return path;
    //const url = `https://firebasestorage.googleapis.com/v0/b/${projectDomain()}/o/${encodeURIComponent(fileName)}?alt=media`;
}

exports.imageURL = (path) => {
    return `https://firebasestorage.googleapis.com/v0/b/${firebase.projectDomain()}/o/${encodeURIComponent(path)}?alt=media`;
}