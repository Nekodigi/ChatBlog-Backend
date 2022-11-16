const firebaseStorage = require("./infrastructure/firebaseStorage/firebaseStorage")
const API_KEY = require("./secret/FirebaseConfig.json").API_KEY;
const {db, addDocument, deleteDocument, extractDocumentsData, extractDocumentsName, getDocuments, updateFieldTransaction} = require("./infrastructure/firestore/firestore");

const { deploy} = require("./secret/GithubConfig.json");
const { workflowDispatch } = require("./infrastructure/github/github");
const { getPostRef, getPost, fixIDs } = require("./infrastructure/firestore/post");




// workflowDispatch(deploy);


const f = async () => {

    // var value = await updateFieldTransaction("posts", "2111120s", "image_paths", (paths) => {paths.push("GOMI");return paths;})
    // console.log(value);

    function change(act, obj) {
        act(obj);
    }
    
    var obj = {};
    change((obj) => {obj.a = 5},obj);
    console.log(obj);

    
    
// let files = await firebaseStorage.bucket.getFiles("images/2211");
// let names = files[0].map(file => file["name"]);
// console.log(names);
// names.forEach(file => console.log(firebaseStorage.getUrl(file)));


// let snapshot = await firestore.db.collection("posts").get();
// let docs = snapshot.docs;
// docs.map(doc => doc.ref.update({"is_applied": true}))

// let docs = (await firestore.db.collection("posts").get()).docs;
// docs.map(doc => doc.ref.update({"is_applied": true}))
}

f()