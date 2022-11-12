const client = require("./const").client;
const User = require("../../structure/class/user");
const field = require("../../structure/const/field");
const status = require("../../structure/const/status");
const message = require("./message").message;

exports.handleEvent = async function handleEvent(event) {

  let res = {"type":"text","text":"メッセージがありません。"};
    switch(event.type){
      case "unfollow":
        return;
      case "message":
        var user = await User.build(event.source.userId);
        res = await message(event, user);
        break;
      case "follow":
        var user = await User.build(event.source.userId);
        if(user.status === status.follow){//おそらく正しく動いていない statusは強制的にidleになる
          res = {type:'text', text:"初登録ありがとうございます。まずはお名前を教えてください。(Webサイトには表示されません)"};//記事を投稿するときは「投稿」と話しかけてください
          user.setStatus(status.name, status.confirming);
        }else{
          res = {type:'text', text:user[field.name]+"さん、お帰りなさい！記事を投稿するときは「投稿」と話しかけてください"};
        }
        break;
    }
  
    return client.replyMessage(event.replyToken, res);
  } 