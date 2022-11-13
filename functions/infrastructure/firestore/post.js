const status = require("../../structure/const/status");
const firestore = require("./firestore");
const db = firestore.db;

exports.getPostsBetween = async (start, end) => {
    let snapshot = await db.collection("posts").where("id", ">=", start).where("id", "<", end).orderBy("id", "desc").get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return firestore.extractDocumentsData(snapshot);
}

async function getPostsAfter(startAfter, limit){
    let snapshot = await db.collection("posts").orderBy("id", "desc").startAfter(startAfter).limit(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return firestore.extractDocumentsData(snapshot);
}
exports.getPostsAfter = getPostsAfter;

async function getPostsBefore(endBefore, limit){
    let snapshot = await db.collection("posts").orderBy("id", "desc").endBefore(endBefore).limitToLast(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return firestore.extractDocumentsData(snapshot);
}
exports.getPostsBefore = getPostsBefore;





async function getPostsBetweenAfter(start, end, startAfter, limit){
    let snapshot = await db.collection("posts").where("id", ">=", start).where("id", "<", end).orderBy("id", "desc").startAfter(startAfter).limit(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return firestore.extractDocumentsData(snapshot);
}
exports.getPostsBetweenAfter = getPostsBetweenAfter;

//include start exclude end
async function getPostsBetweenBefore(start, end, endBefore, limit){
    let snapshot = await db.collection("posts").where("id", ">=", start).where("id", "<", end).orderBy("id", "desc").endBefore(endBefore).limitToLast(limit).get();//.limit(limit)  HOW TO START AT END AT NOT VALUE
    return firestore.extractDocumentsData(snapshot);
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