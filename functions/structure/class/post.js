const { deleteAll } = require("../../infrastructure/firebaseStorage/firebaseStorage");
const firestore = require("../../infrastructure/firestore/firestore")
const field = require("../const/field");
const status = require("../const/status");


class Post{
    constructor(){
    }

    //(await) replace Constructor
    static async build(id, user_id){
        var post = new Post();
        var postData = await firestore.getDocument("posts", id);
        if(postData == undefined){
            var defaultField = {[field.id]:id, [field.status]:status.title, [field.sub_status]:status.confirming, [field.title]:"", [field.created_date]:new Date(), [field.published_date]:new Date(), [field.image_paths]:[], [field.body]:"", [field.user_id]:user_id, [field.is_applied]:true, [field.is_published]:false, [field.related_object_0]:"", [field.location]:""};
            firestore.setDocument("posts", id, defaultField);//use variable for dictionary initialization
            Object.assign(post, defaultField);
        }else{
            Object.assign(post, postData);
        }
        post[field.id] = id;
        return post;
    }

    async delete(){
        this.deleteAllImage();
        await firestore.deleteDocument("posts", this[field.id]);
    }

    deleteAllImage(){
        deleteAll(this[field.image_paths]);
    }

    getStatus(){
        return [this[field.status], this[field.sub_status]];
    }

    setStatus(status_, sub_status){
        this[field.status] = status_;//for instant reference
        this[field.sub_status] = sub_status;//for instant reference
        firestore.updateField("posts", this[field.id], field.status, status_);
        firestore.updateField("posts", this[field.id], field.sub_status, sub_status);
    }
    
    setSubstatus(sub_status){
        this[field.sub_status] = sub_status;//for instant reference
        firestore.updateField("posts", this[field.id], field.sub_status, sub_status);
    }

    setField(field_, value){
        this[field_] = value;
        firestore.updateField("posts", this[field.id], field_, value);
    }
}

module.exports = Post;