const firestorePost = require("../../../infrastructure/firestore/post");
const firestore = require("../../../infrastructure/firestore/firestore");

exports.getJson = async (current) => {
    var currentData = (await firestore.getDocument("preview", current)).data();

    var postPerMonth = (await firestore.getDocument("variable", "postPerMonth")).data();

    return {currentData: currentData, postPerMonth:postPerMonth};
}