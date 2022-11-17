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
    res.send(data);
}

exports.approve = async (req, res) => {
    let hash = getHash(req.params.id);
    if(hash !== req.query.hash){
        res.send("wrong_hash");
    }else{
        let post = await getPost(req.params.id);
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
    let hash = getHash(req.params.id);
    if(hash !== req.query.hash){
        res.send("wrong_hash");
    }else{//まだ投稿されていない記事は拒否できず。状態が変わらない　　状態だけ変える
        let post = await getPost(req.params.id);
        let is_published = post[field.is_published];
        //let sub_status = req.query.type;
        
        if(is_published === false){
            if(post[field.status] === status.denied){
                res.send("already_denied");
            }else{
                await updateField("posts", req.params.id, field.status, status.denied);
                //await updateField("posts", req.params.id, field.sub_status, sub_status);
                res.send("change_to_denied");
            }
        }else{
            incrementField("variables", "post_count", post[field.id].substring(0, 4), -1);
            await updateField("posts", req.params.id, field.status, status.denied);
            //await updateField("posts", req.params.id, field.sub_status, sub_status);
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

exports.apply = async(req, res) => {
    let hash = getHash("");
    if(hash !== req.query.hash){
        res.send("wrong_hash");
    }else{
        let postsSnap = (await db.collection("posts").get()).docs;
        let posts = postsSnap.map(doc => doc.data());
        posts.forEach(post => {
            switch(post.status){
                case "approved":
                    client.pushMessage("Uada2abc97a874ae0a223eb4ddc72691b", text(`「${post.title}」の投稿が承認され、一覧に表示されるようになりました！\n新しいURLからぜひチェックしてみてください。\n${projectURL()}/post/${post.id}}`));
                    break;
                case "denied":
                    client.pushMessage("Uada2abc97a874ae0a223eb4ddc72691b", text(`「${post.title}」の投稿は拒否されたため、一覧には表示されません。お手数ですが、内容を修正した上で再投稿をお願いします。`));
                    break;
                case "deleted":
                    client.pushMessage("Uada2abc97a874ae0a223eb4ddc72691b", text(`「${post.title}」の削除に成功しました。`));
                    break;
            }
            
        });
        postsSnap.map(doc => doc.ref.update({"is_applied": true}))
        res.send("change_to_applied");
    }
}