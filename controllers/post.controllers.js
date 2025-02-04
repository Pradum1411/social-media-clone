const usermodel=require("../model/user.model")
const postmodel=require("../model/post.model")
const commentmodel=require("../model/comment.model")
class UserPost{
    static async likepost (req,res,next){
        try {
            const post=await postmodel.findById({_id:req.params.id})
            // console.log("pp",req.params.id,post)
            post.likes.push(req.session.user.userId)
            await post.save()
            req.flash("success","post liked")
            res.send({color:"red"})           
        } catch (error) {
            req.flash("error","post like failed..")
        }
    }

    static async dislikepost (req,res,next){
        try {
            const post=await postmodel.findById({_id:req.params.id})
            const newlike=post.likes.filter(item=>item!=req.session.user.userId)
            post.likes=newlike
            console.log("pp-",req.params.id,post)
            await post.save()
            res.send({color:"black"})
        } catch (error) {
            req.flash("error","post dislike failed..")
        }
    }

    static async deletepost(req,res,next){
        try {
            await postmodel.findByIdAndDelete ({_id:req.params.id})
            req.flash("success","Post Deleted Successfully..")
            res.redirect("/")
        } catch (error) {
            req.flash("error","Post Delete Failed..")
            console.log("post delete error--",error)
            res.redirect("/")
        }
       
    }

    static async bookmarkpost(req,res,next){
        try {
            let bookmark=await usermodel.findById({_id:req.session.user.userId})
            bookmark.bookmarks.push(req.params.id)
            await bookmark.save()
            res.send({"message":"bookmark successfully"})
        } catch (error) {
            console.log("bookmark failed--",error)
            res.send(error)
        }
    }

    static async removebookmarkpost(req,res,next){
        try {
            let user=await usermodel.findById({_id:req.session.user.userId}) 
            const newbookmark=user.bookmarks.filter(item=>item!=req.params.id)
            user.bookmarks=newbookmark   
            // console.log(newbookmark,)
            //  const newlike=post.likes.filter(item=>item!=req.session.user.userId)
            await user.save()
            res.send({"message":"remove bookmark"})
        } catch (error) {
            console.log("remove bookmark failed--",error)
            res.send(error)
        }
    }

    static async comment(req,res,next){
        try {
            console.log("conn-",req.session.user.userId,req.params.id,req.body.comment)
            let userdata=await usermodel.findById({_id:req.session.user.userId})
            let commentdata=await commentmodel({
                text:req.body.comment,
                auther:req.session.user.username,
                post:req.params.id,
                autherprofilepic:userdata.profilePicture
            })
            await commentdata.save()
            await postmodel.findByIdAndUpdate({_id:req.params.id},{$push:{comments:commentdata._id}})
            req.flash("success","comment successfully..")
            res.send({message:"comment save"})
            
        } catch (error) {
            console.log("comment error",error)
            res.send({message:"comment not save"})
        }
    }
}

module.exports=UserPost