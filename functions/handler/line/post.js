const { projectURL } = require("../../infrastructure/firebase/firebase");
const field = require("../../structure/const/field");
const keyword = require("../../structure/const/keyword");
const status = require("../../structure/const/status");
const sequence = require("./sequence");
const template = require("./templete");



exports.post = async (user, event) => {
    switch(user.post.status){
        case status.title:
            return sequence.getText(user.post, event.message.text.replace(/\n/g, ''), field.title, "タイトル", [status.image, status.confirming], (value, field_name) => template.text(`${field_name}を「${value}」で決定しました！\n次に画像を一枚ずつ送ってください。画像を追加しないときは「${keyword.yes2}」と伝えてくださいね。`));
        case status.image:
            return await sequence.getMultiImage(user.post, event, "画像", [status.body, status.confirming], (paths, field_name) => template.text(`${paths.length}枚の${field_name}を確定しました！\n次に本文を送ってください。`));
        case status.body:
            return sequence.getText(user.post, event.message.text, field.body, "本文", [status.confirming, status.confirming], (value, field_name) => template.confirm(`${field_name}を決定しました！記事の内容に間違いはないですか？`));
        case status.confirming:
            if(event.message.text === keyword.yes){
                user.doPost();
                return template.text(`投稿を確定しました！こちらのリンクからご確認ください。事務局が承認した後一覧からも確認できるようになります。\n${projectURL()}/preview/${user.post[field.id]}`);
            }else if(event.message.text === keyword.no){
                return template.text(`最初からやり直したいときは「${keyword.resetAll}」と話しかけてください。`);
            }else{
                return template.yesno(`投稿`);
            }
    }
}