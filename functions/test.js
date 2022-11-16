const firebaseStorage = require("./infrastructure/firebaseStorage/firebaseStorage")
const API_KEY = require("./secret/FirebaseConfig.json").API_KEY;
const firestore = require("./infrastructure/firestore/firestore");

const { deploy} = require("./secret/GithubConfig.json");
const { workflowDispatch } = require("./infrastructure/github/github");




// workflowDispatch(deploy);

const f = async () => {
    
let files = await firebaseStorage.bucket.getFiles("images/2211");
let names = files[0].map(file => file["name"]);
console.log(names);
names.forEach(file => console.log(firebaseStorage.getUrl(file)));

// let snapshot = await firestore.db.collection("posts").get();
// let docs = snapshot.docs;
// docs.map(doc => doc.ref.update({"is_applied": true}))

// let docs = (await firestore.db.collection("posts").get()).docs;
// docs.map(doc => doc.ref.update({"is_applied": true}))
}

f()