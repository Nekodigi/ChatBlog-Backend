const status = require("../../structure/const/status");
const { extractDocumentsData, db, getDocuments, extractDocumentsName, deleteDocument, addDocument, getDocument } = require("./firestore");

exports.getPostsBetween = async (start, end, limit) => {
    let snapshot;
    if(!limit){
        snapshot = await db.collection("posts").where("id", ">=", start).where("id", "<", end).orderBy("id", "desc").get();
    }else{
        snapshot = await db.collection("posts").where("id", ">=", start).where("id", "<", end).orderBy("id", "desc").limit(limit).get();
    }
    let posts = extractDocumentsData(snapshot);

    return posts;
}

exports.getPostRef = (id) => {//get document by id not document name
    return db.collection("posts").doc(id);
}

exports.getPost = async (id) => {//get document by id not document name
    //return extractDocumentsData(await db.collection("posts").where("id", "==", id).get())[0];
    return getDocument("posts", id);
}

exports.getNextPost = (posts, id) => {
    let i = posts.indexOf(id);
    return posts[i+1]
}

exports.getPrevPost = (posts, id) => {
    let i = posts.indexOf(id);
    return posts[i-1]
}

//you need to run this script when, you changed id manually and document name is not same as id
exports.fixIDs = async () => {
    const posts = await getDocuments("posts");
    const ids = posts.map(post => post.id);
    ids.forEach(id => fixID(id))
}

const fixID = async (actualID) => {
    const currentID = extractDocumentsName( await this.getPostRef(actualID).get())[0];
    const post = await this.getPost(actualID);
    await deleteDocument("posts", currentID);
    await addDocument("posts", actualID, post);
}




//Legacy

async function getPostsAfter(startAfter, limit){
    let snapshot = await db.collection("posts").orderBy("id", "desc").startAfter(startAfter).limit(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return extractDocumentsData(snapshot);
}
exports.getPostsAfter = getPostsAfter;

async function getPostsBefore(endBefore, limit){
    let snapshot = await db.collection("posts").orderBy("id", "desc").endBefore(endBefore).limitToLast(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return extractDocumentsData(snapshot);
}
exports.getPostsBefore = getPostsBefore;





async function getPostsBetweenAfter(start, end, startAfter, limit){
    let snapshot = await db.collection("posts").where("id", ">=", start).where("id", "<", end).orderBy("id", "desc").startAfter(startAfter).limit(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return extractDocumentsData(snapshot);
}
exports.getPostsBetweenAfter = getPostsBetweenAfter;

//include start exclude end
async function getPostsBetweenBefore(start, end, endBefore, limit){
    let snapshot = await db.collection("posts").where("id", ">=", start).where("id", "<", end).orderBy("id", "desc").endBefore(endBefore).limitToLast(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return extractDocumentsData(snapshot);
}
exports.getPostsBetweenBefore = getPostsBetweenBefore;


exports.validatePreviousDocument = async (start, end, previous) => {
    const posts = await getPostsBetweenBefore(start, end, previous, 1);
    if (posts.length == 0)return false;
    else return true;
}

exports.validateNextDocument = async (start, end, next) => {
    const posts = await getPostsBetweenAfter(start, end, next, 1);
    
    if (posts.length == 0)return false;
    else return true;
}