const mongoose=require("mongoose")

const storySchema=mongoose.Schema({
    storyuserid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    
    
    story:{
        type:String
    },
   
},{timestamps:true})

module.exports=mongoose.model("story",storySchema)