const firestore = require("../../infrastructure/firestore/firestore");
const projectURL = require("../../infrastructure/firebase/firebase").projectURL;
const field = require("../../structure/const/field");
const gmail = require("../../infrastructure/gmail/gmail");
const Post = require("./post");
const { check_post } = require("../../structure/const/field");
const status = require("../../structure/const/status");

class User{
    constructor(){
    }

    //(await) replace Constructor
    static async build(id){
        var user = new User();
        user[field.id] = id;
        var userData = (await firestore.getDocument("users", id)).data();
        if(userData == undefined){
            var defaultField = {[field.id]:id, [field.status]:"", [field.sub_status]:"", [field.created_date]:new Date(), [field.post_id]:"", [field.is_admin]:false, [field.check_post]:false, [field.group_id]:""};
            firestore.setDocument("users", id, defaultField);//use variable for dictionary initialization
            user.setStatus(status.follow, "");
        }else{
            var keys = Object.keys(userData);
            keys.forEach(key => {//just want to add value not Object.assign(user, );
                user[key] = userData[key];
            });
            if(!(user[field.post_id] === "" || user[field.post_id] === undefined)){
                user[field.post] = Post.build();
            }
        }
        return user;
    }

    resetImageData(){
        this.setField(field.imageUrl, JSON.stringify([]));
        this.setField(field.imageName, JSON.stringify([]));
    }

    getPostData(){
        return {
            [field.status]  : status.waitingApproval,
            [field.userId]  : this[field.userId],
            [field.title]   : this[field.title],
            [field.body]    : this[field.body],
            [field.imageUrl]: this[field.imageUrl],
            [field.id]      : this[field.id],
            [field.date]    : new Date()
        }
    }

    getStatus(){
        return [this[field.status], this[field.sub_status]];
    }

    setStatus(status_, sub_status){
        this[field.status] = status_;//for instant reference
        this[field.sub_status] = sub_status;//for instant reference
        firestore.updateField("users", this[field.id], field.status, status_);
        firestore.updateField("users", this[field.id], field.sub_status, sub_status);
    }
    
    setSubstatus(sub_status){
        this[field.sub_status] = sub_status;//for instant reference
        firestore.updateField("users", this[field.id], field.sub_status, sub_status);
    }

    setField(field, value){
        this[field] = value;
        firestore.updateField("users", this[field.id], field, value);
    }

    async sendMail(){
        var admins = await firestore.getDocumentsWhere("admins", "checkPost", "==", true);
        var posts = await firestore.getDocumentsWhere("preview", "status", "==", status.waitingApproval);

        if(posts.length === 0)return;
        var body = "";
        body += posts.length+"件の記事が未確認です。記事を確認するリンクを開いて、承認・却下のどちらかのリンクを開いてください。\n";

        posts.forEach((post, i) => {
            body+=`＝＝＝＝＝${i+1}件目＝＝＝＝＝\nタイトル：${post["title"]}\n`;
            body+=`記事を確認する。\n${projectURL()}/preview/${post["id"]}\n`;
            body+=`記事を承認する。\n${projectURL()}/approve/${post["id"]}\n`;
            body+=`記事を却下する。\n${projectURL()}/deny/${post["id"]}\n`;
        });
        admins.forEach(data => {
            
            gmail.send(data["email"], "新しい記事が投稿されました。ご確認ください。", body);
        })
    }

    post(){//tepmporary move to preview
        //firestore.incrementField("variable", "postPerMonth", this[field.id].substring(0, 4), 1);
        firestore.setDocument("preview", this[field.id], this.getPostData());
        this.sendMail();
    }
}

module.exports = User;