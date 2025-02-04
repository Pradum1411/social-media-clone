const mongoose=require("mongoose")

const commentSchema=mongoose.Schema({
    text:{
        type:String,
    },
    
    auther:String,
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
    },
    autherprofilepic:String,
},{timestamps:true})

module.exports=mongoose.model("comment",commentSchema)