const keyword = require("../../structure/const/keyword");
const status = require("../../structure/const/status");
const field = require("../../structure/const/field");
const templete = require("./templete");
const { downloadContent } = require("./util");
const { uploadResizedImage, imageURL } = require("../../infrastructure/firebaseStorage/firebaseStorage");


exports.getText = (object, text, field_, field_name, next_status, confirmed_message, confirmed_action) => {//next_status is combination of status and sub_status
    switch(object[field.sub_status]){
        case status.confirming:
            object.setField(field_, text);
            object.setSubstatus(status.processing);
            return templete.confirmText(field_name, text);
        case status.processing:
            if(text === keyword.yes){
                if(confirmed_action)confirmed_action();
                next_status ? object.setStatus(next_status[0], next_status[1]) : object.setStatus(status.idle, "");
                return confirmed_message ? confirmed_message(object[field_], field_name) : templete.confirmed(object[field_], field_name);
            }else{
                object[field_] = "";
                object.setSubstatus(status.confirming);
                return templete.tellme(field_name);
            }
        default:
            object.setSubstatus(status.confirming);
    }
}

exports.getMultiImage = async (object, event, field_name, next_status, confirmed_message, confirmed_action) => {
    if(event.message.type === "image"){
        try{
            var image = await downloadContent(event.message.id);//saveProcessedImage
            var path = await uploadResizedImage(image, 680, "images");
            let paths = object[field.image_paths]; 
            paths.push(path);
            object.setField(field.image_paths, paths);
            return templete.addImage(imageURL(path), paths.length);
        }catch(e){
            console.log(e);
            return templete.text(`エラーが発生しました。別の${field_name}を試してください。`);
        }
    }else{
        if(event.message.text == keyword.image_reset_all){
            var paths = object[field.image_paths];
            object.deleteAllImage();
            return templete.text(`${field_name}を全て除外しました。もう一度${field_name}をを1枚ずつ送ってください。`);
        }else if(event.message.text === keyword.yes || event.message.text === keyword.yes2){
            var paths = object[field.image_paths];
            if(confirmed_action)confirmed_action();
            next_status ? object.setStatus(next_status[0], next_status[1]) : object.setStatus(status.idle, "");
            return confirmed_message ? confirmed_message(paths, field_name) : templete.text(`${field_name}を確定しました！\n次に本文を入力してください。`);
        }else if(event.message.text === keyword.no){
            return templete.text(`追加する${field_name}をを1枚ずつ送ってください。\n間違えて${field_name}を投稿して全て選び直す場合は「${keyword.image_reset_all}」と伝えてください。`);
        }else{
            return templete.helpMessage();
        }
    }
}