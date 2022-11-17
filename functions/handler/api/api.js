const { getDocument, updateField, incrementField, db } = require("../../infrastructure/firestore/firestore");
const { getPost } = require("../../infrastructure/firestore/post");
const field = require("../../structure/const/field");
const status = require("../../structure/const/status");
const { getPosts, getPaths, getPostsArray, getPreview, getPostCount, getposts, getPostSide } = require("./data/posts");
const { API_KEY } = require("../../secret/FirebaseConfig.json");
const { getHash } = require("../../infrastructure/crypto/hash");
const { deploy } = require("../../secret/GithubConfig.json");
const { workflowDispatch } = require("../../infrastructure/github/github");
const User = require("../../structure/class/user");
const Post = require("../../structure/class/post");
const { client } = require("../../infrastructure/line/line");
const { text } = require("../../infrastructure/line/templete");
const { projectURL } = require("../../infrastructure/firebase/firebase");
const e = require("cors");

exports.test = async (req, res) => {

    res.send("API");
}

const postBetween_path_data = async(req, res, start, end, n) => {
    let posts_ = await getPosts(start, end);
    if(req.query.page === undefined){
        let paths = getPaths(posts_, n);
        res.send(paths);
    }else{
        let page = Number(req.query.page);
        let postsArray = getPostsArray(posts_, n);
        let posts = {posts:postsArray[page-1]};
        posts.prev_id = page-1 >= 1 ? page - 1 : undefined;
        posts.next_id = page+1 <= postsArray.length ? page + 1 : undefined;
        if(!posts)posts = [];
        res.send(posts);
    }
}

exports.archive = async (req, res) => {
    await postBetween_path_data(req, res, "00000000", "zzzzzzzz", req.query.n ? Number(req.query.n) : 30);
}

exports.monthly_archive = async (req, res) => {
    let YYMM = Number(req.params.YYMM);
    await postBetween_path_data(req, res, YYMM+"0000", (YYMM)+"zzzz", req.query.n ? Number(req.query.n) : 30);
}

exports.post = async (req, res) => {
    let data = await getPostSide(req.params.id);
    res.send(data);
}

exports.all_posts_path = async (req, res) => {
    let posts = await getPosts("00000000", "zzzzzzzz");
    let ids = posts.map(post => post[field.id]);
    res.send(ids);
}

exports.monthly_count = async(req, res) => {
    let post_count = await getPostCount();
    res.send(post_count);
}

exports.preview = async (req, res) => {
    let data = await getPreview(req.params.id);
    if(data === undefined) res.send("not_found");
    else res.send(data);
}

exports.approve = async (req, res) => {
    let hash = getHash("approve"+req.params.id);
    if(hash !== req.query.hash){
        res.send("wrong_hash");
    }else{
        let post = await getPost(req.params.id);
        if(post === undefined){res.send("not_found");return;}
        let is_published = post[field.is_published];
        if(is_published === true){
            if(post[field.status] === status.approved){
                await updateField("posts", req.params.id, field.status, status.approved);
                res.send("already_approved");
            }else{
                res.send("change_to_approved");
            }
        }else{
            await updateField("posts", req.params.id, field.status, status.approved);
            await updateField("posts", req.params.id, field.is_published, true);
            await updateField("posts", req.params.id, field.is_applied, false);
            workflowDispatch(deploy);

            //when applied　　無限 publishが出来てしまう。
            incrementField("variables", "post_count", post[field.id].substring(0, 4), 1);
            await updateField("posts", req.params.id, field.is_published, true);

            res.send("change_to_approved");
        }
    }
    
}

exports.deny = async (req, res) => {
    let hash = getHash("deny"+req.params.id);
    if(hash !== req.query.hash){
        res.send("wrong_hash");
    }else{//まだ投稿されていない記事は拒否できず。状態が変わらない　　状態だけ変える
        let post = await getPost(req.params.id);
        if(post === undefined){res.send("not_found");return;}
        let is_published = post[field.is_published];
        
        if(is_published === false){
            if(post[field.status] === status.denied){
                res.send("already_denied");
            }else{
                await updateField("posts", req.params.id, field.status, status.denied);
                res.send("change_to_denied");
            }
        }else{
            incrementField("variables", "post_count", post[field.id].substring(0, 4), -1);
            await updateField("posts", req.params.id, field.status, status.denied);
            await updateField("posts", req.params.id, field.is_published, false);
            await updateField("posts", req.params.id, field.is_applied, false);
            workflowDispatch(deploy);

            //when applied
            incrementField("variables", "post_count", post[field.id].substring(0, 4), 1);
            await updateField("posts", req.params.id, field.is_published, false);
            
            res.send("change_to_denied");
        }
    }
}

exports.delete = async (req, res) => {
    let hash = getHash("delete"+req.params.id);
    if(hash !== req.query.hash){
        res.send("wrong_hash");
    }else{//まだ投稿されていない記事は拒否できず。状態が変わらない　　状態だけ変える
        let post = await Post.build(req.params.id, "");//this post soon deleted so, no need to worry wrong create
        await post.delete();
        res.send("deleted");
    }
}

exports.apply = async(req, res) => {
    let hash = getHash("apply");
    if(hash !== req.query.hash){
        res.send("wrong_hash");
    }else{
        let postsSnap = (await db.collection("posts").get()).docs;
        let posts = postsSnap.map(doc => doc.data());
        posts.forEach(post => {
            if(post.is_applied === false){
                switch(post.status){
                    case "approved":
                        client.pushMessage(post.user_id, text(`「${post.title}」の投稿が承認され、一覧に表示されるようになりました！\n新しいURLからぜひチェックしてみてください。\n${projectURL()}/post/${post.id}`));
                        break;
                    case "denied":
                        client.pushMessage(post.user_id, text(`「${post.title}」の投稿は拒否されたため、一覧には表示されません。\nお手数ですが、内容を修正した上で再投稿をお願いします。`));
                        break;
                }
            }
            
        });
        postsSnap.map(doc => doc.ref.update({"is_applied": true}))
        res.send("change_to_applied");
    }
}