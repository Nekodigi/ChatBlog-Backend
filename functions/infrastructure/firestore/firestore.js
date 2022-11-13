const admin = require("../firebase/firebase").admin;

const firestore = admin.firestore;
const db = admin.firestore();

module.exports.db = db;

exports.setDocument = async (collection, document, data) => {//set exsisting doc field or add doc with "given name"
    await db.collection(collection).doc(document).set(data);
}

exports.addDocument = async (collection, document, data) => {
    await db.collection(collection).doc(document).set(data);
}

exports.deleteDocument = async (collection, document) => {
    await db.collection(collection).doc(document).delete();
}

exports.getDocument = async (collection, document) => {//(await getDocument()).data() to get data
    return (await db.collection(collection).doc(document).get()).data();
}

exports.getDocuments = async (collection) => {
    let snapshot = await db.collection(collection).get();//return snapshot
    return extractDocumentsData(snapshot);
}

exports.getDocumentsWhere = async (collection, field, op, value) => {
    let snapshot = await db.collection(collection).where(field, op, value).get();//return snapshot
    return extractDocumentsData(snapshot);
}

exports.getDocumentsOrderLimit = async (collection, orderField, orderMethod, limit) => {
    let snapshot = await db.collection(collection).orderBy(orderField, orderMethod).limit(limit).get();//HOW TO START AT END AT NOT VALUE
    return extractDocumentsData(snapshot);
}

function extractDocumentsData(snapshot){
    return snapshot.docs.map(doc => doc.data());
}
exports.extractDocumentsData = extractDocumentsData;

exports.extractDocumentsName = (snapshot) => {
    return snapshot.docs.map(doc => doc['_ref']['_path']['segments'][1]);
}

exports.updateDocument = async (collection, document, data) => {//set exsisting doc field or add doc with "given name"
    await db.collection(collection).doc(document).update(data);
}

exports.updateField = async (collection, document, fieldName, value) => {//set exsisting doc field or add doc with "given name"
    await db.collection(collection).doc(document).set({[fieldName]: value}, {merge: true});//or .update({[fieldName]: value}) (does not create new when not exsist)
}

exports.incrementField = (collection, document, fieldName, value) => {
    //db.collection(collection).doc(document).update(fieldName, firestore.FieldValue.increment(value));
    db.collection(collection).doc(document).set({[fieldName]: firestore.FieldValue.increment(value)}, {merge: true});
}