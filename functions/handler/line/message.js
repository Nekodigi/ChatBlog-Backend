const keyword = require("../../structure/const/keyword");
const status = require("../../structure/const/status");
const field = require("../../structure/const/field");
const { postsList, text, helpMessage } = require("../../infrastructure/line/templete");
const { getText } = require('../../infrastructure/line/sequence');
const { post } = require('./post');
const { post_delete } = require("./post_delete");
const { getPostsBetween } = require("../../infrastructure/firestore/post");



exports.message = async (event, user) => {
    //console.log(event.message.text);
    //console.log(user.status);
    if(event.message.type == "text"){
        switch(event.message.text){
            case "dev":
                
                return res_;
                //return text("テストコマンド");
                break;
            case keyword.resetAll:
                user.reset();
                user.setStatus(status.idle, "");
                return text("作業を中断しました。新しく「"+keyword.post+"」や「"+keyword.delete_post+"」ができます。");//選択肢を示したうえでQuick Replyはあり。
            case keyword.help:
                return helpMessage(user);
            case keyword.delete_post:
                user.setStatus(status.post_deleting, status.waiting);
                let posts = await getPostsBetween("00000000", "zzzzzzzz");
                posts = posts.filter(post => post.user_id===user.id);
                posts = posts.filter(post => post.status===status.approved || post.status===status.waiting_approval);
                posts = posts.slice(0, 10);
                let res = [postsList(posts,(post) => [{"type": "message","label": "削除","text": post.id}])];
                res.push(text(`記事の削除ですね。\n削除したい記事のURLまたはIDを教えてください。\n最近の10件の投稿であれば、上の一覧からも選べます。`));
                return res;
            case keyword.post:
                if(user.status === status.idle){
                    user.setStatus(status.posting, "");
                    await user.newPost();
                    return text(`新しい記事を投稿しましょう！\nまずはタイトルを教えてください。`);
                }else return text(`新しく投稿するためには、まず今の作業を終了していただく必要があります。\n作業を終了するときは「${keyword.resetAll}」と伝えてください。`);
        }
    }

    switch(user.status){
        case status.name:
            return getText(user, event.message.text, field.name, "お名前", [status.idle, ""], (value, field_name) => {return text(`${value}さん、よろしくお願いします！新しく記事を投稿したいときは「${keyword.post}」と話しかけてください。`)});
        case status.posting:
            return await post(user, event);
        case status.post_deleting:
            return await post_delete(user, event);
    }

    

    return helpMessage(user);
}


