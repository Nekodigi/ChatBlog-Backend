const keyword = require("../../structure/const/keyword");
const status = require("../../structure/const/status");
const field = require("../../structure/const/field");
const templete = require("./templete");


exports.confirmText = (field_, field_name, user, text, next_status, confirmed_message, confirmed_action) => {
    switch(user[field.sub_status]){
        case status.confirming:
            user[field_] = text;
            user.setSubstatus(status.processing);
            return templete.confirmText(field_name, text);
        case status.processing:
            if(text === keyword.yes){
                confirmed_action ? confirmed_action() : user.setStatus(status.idle, "");
                return confirmed_message ? confirmed_message(field_, field_name) : templete.confirmed(field_, field_name);
            }else{
                user[field_] = "";
                user.setSubstatus(status.confirming);
                return templete.tellme(field_name);
            }
            break;
    }
}