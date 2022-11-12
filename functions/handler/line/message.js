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
const { post } = require('../../structure/const/field');



exports.message = async (event, user) => {
    //console.log(event.message.text);
    //console.log(user.status);
    if(event.message.type == "text"){
        switch(event.message.text){
            case keyword.resetAll:
                user.resetImageData();
                user.setStatus("waitingAction");
                return templete.text("作業を中断しました。記事を投稿するときは「"+keyword.post+"」と話しかけてください。");//選択肢を示したうえでQuick Replyはあり。
            case keyword.post:
                if(user[field.status] === status.idle){
                    user.setStatus(status.posting);
                    return templete.text(`新しい記事を投稿しましょう！まずはタイトルを教えてください。`);
                }else return templete.text(`新しく投稿するためには、まず今の作業を終了していただく必要があります。\n作業を終了するときは${keyword.resetAll}と伝えてくださいね。`);
            case keyword.help:
                return helpMessage();
        }

        switch(user.status){
            case status.name:
                return sequence.confirmText(field.name, "お名前", user, event.message.text, status.idle, (field, field_name) => {return templete.text(`${field}さん、よろしくお願いします！新しく記事を投稿したいときは「${keyword.post}」と話しかけてください。`)});
            case status.post:
                return post(user, event.message.text);
        }
    }

    

    return helpMessage();
}

function helpMessage(){//選択肢を示す。
    return {'type': 'text','text':"すみません、よく分かりませんでした。\n今の作業を終了したいときは「"+keyword.resetAll+"」と話しかけてください。新しく記事を投稿したいときは「"+keyword.post+"」と話しかけてください。" };
}

