const mongoose=require("mongoose")

const postSchema=mongoose.Schema({
    caption:{
        type:String,
       default:""
    },
    image:{
        type:String,
    },
    
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
       },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
},{timestamps:true})

module.exports=mongoose.model("post",postSchema)