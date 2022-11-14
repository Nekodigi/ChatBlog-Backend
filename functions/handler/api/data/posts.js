const { getDocument } = require("../../../infrastructure/firestore/firestore");
const { getPostsBetween, getPostsAfter, getPostsBefore, getNextPost, getPrevPost } = require("../../../infrastructure/firestore/post");
const field = require("../../../structure/const/field");
const status = require("../../../structure/const/status");

const reducePostData = (post) => {
    return{
        [field.id]:post.id,
        [field.status]:post.status,
        [field.is_published]:post.is_published,
        [field.title]:post.title,
        [field.created_date]:post.created_date,
        [field.image_paths]:post.image_paths,
        [field.body]:post.body
    }
}

//note! Approved only
const getPosts = async (start, end) => {
    let posts = await getPostsBetween(start, end);
    return posts.filter(post => post[field.is_published] === true).map(post => reducePostData(post));
}
exports.getPosts = getPosts;

exports.getPaths = (posts, size) => {
    let n = Math.ceil(posts.length/size);
    return Array.from({length: n}, (_, i) => i + 1);//1 to N array  https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
}

exports.getPostsArray = (posts, size) => {
    let array = [];
    for (let i = 0; i < posts.length; i += size) {//https://stackoverflow.com/questions/8495687/split-array-into-chunks
        const chunk = posts.slice(i, i + size);
        array.push(chunk);//
    }
    return array;
}

exports.getPreview = async (id) => {
    return reducePostData(await getDocument("posts", id));
}

exports.getPost = async (id) => {
    let posts = await getPosts("00000000", "zzzzzzzz");
    let ids = posts.map(post => post[field.id]);
    
    let post = reducePostData(await getDocument("posts", id));
    
    let data = {post:post};
    let next_id = ids[ids.indexOf(id)+1];
    //let next = (await getPostsAfter(id, 1))[0];
    let prev_id = ids[ids.indexOf(id)-1];
    //let prev = (await getPostsBefore(id, 1))[0];
    if(next_id !== undefined)data.next_id = next_id; 
    if(prev_id !== undefined)data.prev_id = prev_id; 
    return data;
}

exports.getPostCount = async () => {
    let counts = await getDocument("variables", "post_count");
    let keys = Object.keys(counts).sort().reverse();
    console.log(keys);
    let post_count = {};
    let subPost_count = {};
    let prevYY = keys[0].substring(0, 2);
    keys.forEach(key => {
        let YY = key.substring(0, 2);
        if(YY != prevYY){
            post_count[prevYY] = subPost_count;
            subPost_count = {};
            prevYY = YY;
        }
        subPost_count[key.substring(2, 4)] = counts[key];
    });
    post_count[prevYY] = subPost_count;
    return post_count;
}