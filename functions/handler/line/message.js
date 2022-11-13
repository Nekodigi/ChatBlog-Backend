const date = require('date-and-time')//npm install date-and-time https://www.geeksforgeeks.org/node-js-date-format-api/
const keyword = require("../../structure/const/keyword");
const status = require("../../structure/const/status");
const field = require("../../structure/const/field");
const templete = require("./templete");
const storage = require("../../infrastructure/firebaseStorage/firebaseStorage");
const { downloadContent } = require("./util");
const { randomChar } = require("../../util/random");
const firestore = require("../../infrastructure/firestore/firestore");
const { projectDomain, projectURL } = require("../../infrastructure/firebase/firebase");
const sharp = require('sharp');//image resize lib  
const { confirming_name } = require('../../structure/const/status');
const sequence = require('./sequence');
const { post } = require('./post');



exports.message = async (event, user) => {
    //console.log(event.message.text);
    //console.log(user.status);
    if(event.message.type == "text"){
        switch(event.message.text){
            case keyword.resetAll:
                user.reset();
                user.setStatus(status.idle, "");
                return templete.text("作業を中断しました。記事を投稿するときは「"+keyword.post+"」と話しかけてください。");//選択肢を示したうえでQuick Replyはあり。
            case keyword.post:
                if(user.status === status.idle){
                    user.setStatus(status.posting, "");
                    await user.newPost();
                    return templete.text(`新しい記事を投稿しましょう！まずはタイトルを教えてください。`);
                }else return templete.text(`新しく投稿するためには、まず今の作業を終了していただく必要があります。\n作業を終了するときは「${keyword.resetAll}」と伝えてください。`);
            case keyword.help:
                return templete.helpMessage();
        }
    }

    switch(user.status){
        case status.name:
            return sequence.getText(user, event.message.text, field.name, "お名前", [status.idle, ""], (value, field_name) => {return templete.text(`${value}さん、よろしくお願いします！新しく記事を投稿したいときは「${keyword.post}」と話しかけてください。`)});
        case status.posting:
            return await post(user, event);
    }

    

    return templete.helpMessage();
}


