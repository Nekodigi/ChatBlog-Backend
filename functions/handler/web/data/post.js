const firestorePost = require("../../../infrastructure/firestore/post");
const firestore = require("../../../infrastructure/firestore/firestore");

exports.getJson = async (current) => {

    var prevData = await firestorePost.getPostsAfter(current, 1);
    var nextData = await firestorePost.getPostsBefore(current, 1);
    var previous = undefined;
    var next = undefined;
    if(prevData.length != 0){prevData = prevData[0];previous = prevData["id"];}
    if(nextData.length != 0){nextData = nextData[0];next = nextData["id"];}
    var currentData = (await firestore.getDocument("contents", current)).data();

    var postPerMonth = (await firestore.getDocument("variable", "postPerMonth")).data();

    return {currentData: currentData, prevData: prevData, nextData:nextData, postPerMonth:postPerMonth};
}