const status = require("../const/status");


class Post{
    constructor(){
    }

    //(await) replace Constructor
    static async build(id){
        var post = new Post();
        post.id = id;
        var postData = (await firestore.getDocument("posts", id)).data();
        if(postData == undefined){
            user[field.status] = status_;
            var defaultField = {[field.id]:id, [field.status]:status_, [field.sub_status]:"", [field.created_date]:new Date(), [field], [field.post_id]:"", [field.is_admin]:false, [field.check_post]:false, [field.group_id]:""};
            firestore.setDocument("posts", userId, defaultField);//use variable for dictionary initialization
            post.setStatus(status.title, status.waiting);
        }else{
            var keys = Object.keys(postData);
            //console.log(keys);
            keys.forEach(key => {
                post[key] = postData[key];
            });
        }
        return user;
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

    setField(field, value){
        this[field] = value;
        firestore.updateField("posts", this[field.id], field, value);
    }
}

module.exports = Post;