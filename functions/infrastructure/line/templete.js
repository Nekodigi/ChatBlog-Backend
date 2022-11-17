const keyword = require("../../structure/const/keyword");
const status = require("../../structure/const/status");
const { imageURL } = require("../firebaseStorage/firebaseStorage");

exports.postsList = (posts) => {
    return {
        "type": "template",
        "altText": "投稿を選んでください",
        "template": {
          "type": "carousel",
          "columns": 
            posts.map(post => {
                let column = {
                    "title":post.title.substring(0,40).replace(/\n/g, ""),//max 40
                    "text":post.body.substring(0,60).replace(/\n/g, ""),//max 60 with image max  120 without image
                    "defaultAction": {
                        "type": "uri",
                        "label": "View detail",
                        "uri": "http://example.com/page/123"
                    },
                    "actions": [
                        {
                          "type": "message",
                          "label": "削除",
                          "text": post.id
                        }
                    ]
                }
                if(post.image_paths.length > 0){column["thumbnailImageUrl"] = imageURL(post.image_paths[0]);
                }else{ column["thumbnailImageUrl"] = "https://storage.googleapis.com/foodbankbotdev.appspot.com/white.png";}
                return column;
            })
          ,
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
        }
      }
}

exports.confirmText = (field, value) => {
    return {
        "type": "template",
        "altText": "確認",
        "template": {
            "type": "confirm",
            "actions": [
                {
                    "type": "message",
                    "label": keyword.yes,
                    "text": keyword.yes
                },
                {
                    "type": "message",
                    "label": keyword.no,
                    "text": keyword.no
                }
            ],
            "text": field+"は「"+value+"」で良いですか？"
        }
      };
}

exports.confirm = (discription) => {
    return {
        "type": "template",
        "altText": "確認",
        "template": {
            "type": "confirm",
            "actions": [
                {
                    "type": "message",
                    "label": keyword.yes,
                    "text": keyword.yes
                },
                {
                    "type": "message",
                    "label": keyword.no,
                    "text": keyword.no
                }
            ],
            "text": discription
        }
      };
}

exports.confirmImage = (url) => {
    return {
        "type": "template",
        "altText": "確認",
        "template": {
            "type": "buttons",
            "actions": [
                {
                    "type": "message",
                    "label": keyword.yes,
                    "text": keyword.yes
                },
                {
                    "type": "message",
                    "label": keyword.no,
                    "text": keyword.no
                }
            ],
            "thumbnailImageUrl": url,//'https://line.me/static/115d5539e2d10b8da66d31ce22e6bccd/84249/favicon.png',
            //"title": "タイトルです",
            "text": "画像はこれで良いですか？"//文字数制限に厳重注意
        }
      }
}

exports.addImage = (url, n) => {
    return {
        "type": "template",
        "altText": "確認",
        "template": {
            "type": "buttons",
            "actions": [
                {
                    "type": "message",
                    "label": keyword.yes,
                    "text": keyword.yes
                },
                {
                    "type": "message",
                    "label": keyword.no,
                    "text": keyword.no
                }
            ],
            "thumbnailImageUrl": url,//'https://line.me/static/115d5539e2d10b8da66d31ce22e6bccd/84249/favicon.png',
            //"title": "タイトルです",
            "text": `画像を追加しました。\n画像は以上の${n}点でよろしいですか？`//文字数制限に厳重注意
        }
      }
}

exports.yesno = (value) => {
    return {'type':'text','text':value+'を決定するかどうか「'+keyword.yes+'」か「'+keyword.no+'」で答えてください。困った時は「ヘルプ」と話しかけてくださいね！'};
}

exports.confirmed = (field, value) => {
    return {'type':'text','text': field+'を「'+value+'」で確定しました！'}
}

exports.confirmed = (field) => {
    return {'type':'text','text': field+'を確定しました！'}
}

exports.tellme = (field) => {
    return {'type':'text', 'text':field+'を教えてください。'}
}

exports.request = (field) => {
    return {'type':'text', 'text':field+'を送ってください。'}
}

exports.text = (text) => {
    return {'type':'text', 'text':text}
}

exports.helpMessage = (user) => {//選択肢を示す。
    switch(user.status){
        case status.idle:
            return {'type': 'text','text':`「${keyword.post}」「${keyword.delete_post}」が出来ます。何をしますか？` };
        default:
            return {'type': 'text','text':"今の作業を終了したいときは「"+keyword.resetAll+"」と話しかけてください。" };
    }
    
}
