const postmodel = require("../model/post.model")
const usermodel = require("../model/user.model")
const messagemodel=require("../model/message.model")
class Message {
    static async viewuser(req, res, next) {
        try {
         
        let user = await usermodel.findOne({ _id: req.session.user.userId })
            .populate("posts")
            .populate("followers")
            .populate("following")
            .populate("bookmarks")
        let alluser = await usermodel.find({ _id: { $ne: req.session.user.userId } })
     
        let post = await postmodel.find().sort({ createdAt: -1 })
            .populate("auther")
            .populate("comments")
            .populate("likes")
        res.render("message_user", ({ post, user, alluser }))
           
    } catch (error) {
            res.send(error)
    }
    }

    static async usermessage(req, res, next) {
        try {
       
        let user = await usermodel.findOne({ _id: req.session.user.userId })
            .populate("posts")
            .populate("followers")
            .populate("following")
            .populate("bookmarks")
        let alluser = await usermodel.find({ _id: { $ne: req.session.user.userId } })
        let usermessage = await usermodel.findOne({ _id: req.params.id })
        const chat = await messagemodel.find({
            $or: [
              { $and: [{ senderId: req.params.id }, { receiverId: req.session.user.userId }] },
              { $and: [{ receiverId: req.params.id }, { senderId: req.session.user.userId }] }
            ]
          });
        let post = await postmodel.find().sort({ createdAt: -1 })
            .populate("auther")
            .populate("comments")
            .populate("likes")
        res.render("message", ({ post, user, alluser, usermessage , chat}))     
    } catch (error) {
        res.send(error)
    }

    }

    static async savechat(req, res, next) {
            try {
            let messagedata=new messagemodel({senderId: req.body.senderId,
            receiverId: req.body.receiverId,
            message: req.body.message})
            await messagedata.save()
            // console.log(messagedata)
            res.send(messagedata)
        } catch (error) {
            console.log("save chat erroe--", error)
        }
    }
    static async deletchat(req, res, next) {
        try {
            await messagemodel.findByIdAndDelete({_id:req.body.chatid})
       
        res.send(true)
    } catch (error) {
        console.log(" delete chat erroe--", error)
    }
}
}
module.exports = Message