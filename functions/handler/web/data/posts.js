const firestorePost = require("../../../infrastructure/firestore/post");
const firestore = require("../../../infrastructure/firestore/firestore");

exports.getJson = async (next, previous, start, end, limit, statusMessage) => {
    if(start == undefined)start = "00000000";
    if(end == undefined)end = "zzzzzzzz";
    if(next == undefined && previous == undefined)previous = "zzzzzzzz";

    var posts = undefined;
    if(previous){
      posts = await firestorePost.getPostsBetweenAfter(start, end, previous, limit);
    }else{
      posts = await firestorePost.getPostsBetweenBefore(start, end, next, limit);
    }

    
    if(posts[0] == undefined)return;//SHOULD GO 404
    var forNext = posts[0]["id"];
    var forPrevious = undefined;
    if(posts[limit-1] != undefined)forPrevious = posts[limit-1]["id"];

    if(forPrevious != undefined && !await firestorePost.validateNextDocument(start, end, forPrevious))forPrevious = undefined;
    if(forNext != undefined && !await firestorePost.validatePreviousDocument(start, end, forNext))forNext = undefined;

    var postPerMonth = (await firestore.getDocument("variable", "postPerMonth")).data();
    
    var queryPrev = undefined;
    var queryNext = undefined;
    var betweenExt = "";
    if(start != "00000000")betweenExt+="&start="+start;
    if(end != "zzzzzzzz")  betweenExt+="&end="+end;

    if(forPrevious != undefined){
      queryPrev = "?previous="+forPrevious;
      queryPrev += betweenExt;
    }
    if(forNext != undefined){
      queryNext = "?next="+forNext;
      queryNext += betweenExt;
    }    

    return {posts:  posts, statusMessage: statusMessage, start:start, end:end, queryPrev: queryPrev, queryNext: queryNext, postPerMonth:postPerMonth};
}