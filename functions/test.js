const firebaseStorage = require("./infrastructure/firebaseStorage/firebaseStorage")
const API_KEY = require("./secret/FirebaseConfig.json").API_KEY;
const {db, addDocument, deleteDocument, extractDocumentsData, extractDocumentsName, getDocuments, updateFieldTransaction} = require("./infrastructure/firestore/firestore");

const { deploy} = require("./secret/GithubConfig.json");
const { workflowDispatch } = require("./infrastructure/github/github");
const { getPostRef, getPost, fixIDs, getPostsBetween } = require("./infrastructure/firestore/post");
const { client } = require("./infrastructure/line/line");
const { text, postsList } = require("./infrastructure/line/templete");
const field = require("./structure/const/field");
const { projectURL, URLtoPostID } = require("./infrastructure/firebase/firebase");




const f = async () => {
    //console.log(URLtoPostID("https://foodbankbotdev.web.app/preview?id=221117d6"));
}

f()