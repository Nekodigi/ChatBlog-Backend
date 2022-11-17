const { getPost } = require("../../infrastructure/firestore/post");
const field = require("../../structure/const/field");
const status = require("../../structure/const/status");


exports.post_delete = (event, user) => {
    switch(user.sub_status){
        case status.waiting:
            let ID = URLtoPostID("https://foodbankbotdev.web.app/preview?id=221117d6");
            let post = getPost(ID);
            console.log(post)
            break;
        case status.confirming:

            break;
            
    }
}