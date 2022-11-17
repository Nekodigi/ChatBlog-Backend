const { URLtoPostID } = require("../../infrastructure/firebase/firebase");
const { getPost } = require("../../infrastructure/firestore/post");
const { workflowDispatch } = require("../../infrastructure/github/github");
const { text, confirm, helpMessage } = require("../../infrastructure/line/templete");
const Post = require("../../structure/class/post");
const field = require("../../structure/const/field");
const keyword = require("../../structure/const/keyword");
const status = require("../../structure/const/status");
const { deploy } = require("../../secret/GithubConfig.json");


exports.post_delete = async (user, event) => {
    switch(user.sub_status){
        case status.waiting:
            
            let ID = URLtoPostID(event.message.text);
            let post = await getPost(ID);
            if(!post){
                return text(`記事が見つかりませんでした。\n記事削除をやめるときは「全てやり直す」と伝えてください。`);
            }else{
                if(!user.is_admin){
                    if(post.user_id != user.id){
                        return text(`自分が書いた記事のみ削除できます。`);
                    }
                }
            }
            user.setField(field.post_id, ID);
            user.setSubstatus(status.confirming);
            return confirm(`「${post.title.substring(0, 40)}」を削除しますか？\n※この操作は取り消せません。`);
        case status.confirming:
            switch(event.message.text){
                case keyword.yes:
                    let post = await Post.build(user.post_id, "");//this post soon deleted so, no need to worry wrong create
                    let title = post.title.substring(0, 40);
                    await post.delete();
                    workflowDispatch(deploy);
                    user.setStatus(status.idle, "");
                    return text(`「${title}」を削除しました。`);
                case keyword.no:
                    user.setStatus(status.idle, "");
                    return text(`記事の削除をキャンセルしました。`);
                default:
                    return helpMessage(user);
            }
            break;
            
    }
}