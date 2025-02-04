var express = require('express');
var router = express.Router()
const controllers = require("../controllers/user.controllers")
const verifytoken = require("../controllers/user.auth")
const sendotp = require("../controllers/sendotp")
const sendmail = require("../controllers/sendotp")
const postcontrollers=require("../controllers/post.controllers")
const messagecontrollers=require("../controllers/message.controllers")
const postmodel=require("../model/post.model")
const usermodel=require("../model/user.model")
const storymodel=require("../model/story.model")
const commentmodel=require("../model/comment.model")
const story=require("../controllers/story.controllers")
require("socket.io-client");
const { Query } = require('mongoose');

/* GET home page. */
router.get('/', async function (req, res, next) {
  let user=null
  let alluser=null
  if(req.session.user){
    user = await usermodel.findOne({_id:req.session.user.userId})
    .populate("posts")
    .populate("followers")
    .populate("following")
    .populate("bookmarks")
     alluser = await usermodel.find({ _id: { $ne: req.session.user.userId } });
  }

  let post = await postmodel.find().sort({createdAt:-1})
  .populate("auther")
  .populate("comments")
  .populate("likes")
 let story=await storymodel.find()
  .populate("storyuserid")
  
  res.render('home', {user,post,alluser ,story});
});


// router.get('/mail', sendmail);
router.get('/login', async function (req, res, next) {
  res.render('login2',{"user":null});
});

router.get('/logout', verifytoken, controllers.logout)
router.get('/getprofile/:id', verifytoken, controllers.getprofile)
router.get('/editprofile', verifytoken, controllers.editprofile)
router.get('/resetpassword', function (req, res, next) {
  res.render("resetpassword1", {user:null, email: req.session.email });
});


router.post('/register', controllers.register, verifytoken, (req, res) => { res.redirect("/") });
router.post('/login', controllers.login, verifytoken, (req, res) => { res.redirect("/") });
router.post('/resetpassword', controllers.reset_password);
router.post('/getotp',sendotp, (req, res) => {res.redirect("/resetpassword")});
router.post('/createpost', verifytoken, controllers.createpost);
router.post("/editprofile",verifytoken, controllers.editprofile)
router.post("/addstory",verifytoken,story.savestroy)
router.delete("/removestory/:id",verifytoken,story.removestory)



router.get("/unfollow/:id",async(req,res)=>{
  let currentuser=await usermodel.findOne({_id:req.session.user.userId})
  let otheruser=await usermodel.findOne({_id:req.params.id})
  let newfollowing=currentuser.following.filter(item=>item!=req.params.id)
  currentuser.following=newfollowing
  await currentuser.save()
  let newfollowers=otheruser.followers.filter(item=>item!=req.session.user.userId)
  otheruser.followers=newfollowers
  await otheruser.save()

  res.redirect("/")
})
router.get("/follow/:id",async(req,res)=>{
  await usermodel.findByIdAndUpdate({
    _id:req.session.user.userId
  },{$push:{following:req.params.id}})

  await usermodel.findByIdAndUpdate({
    _id:req.params.id
  },{$push:{followers:req.session.user.userId}})
  res.redirect("/")
})


router.get("/messages",verifytoken,messagecontrollers.viewuser)
router.get("/usermessages/:id",verifytoken,messagecontrollers.usermessage)
router.get("/likepost/:id",verifytoken,postcontrollers.likepost)
router.get("/dislikepost/:id",verifytoken,postcontrollers.dislikepost)
router.get("/deletepost/:id",verifytoken,postcontrollers.deletepost)
router.get("/bookmarkpost/:id",verifytoken,postcontrollers.bookmarkpost)
router.get("/removebookmarkpost/:id",verifytoken,postcontrollers.removebookmarkpost)
router.post("/comment/:id",verifytoken,postcontrollers.comment)
router.post("/savechat",verifytoken,messagecontrollers.savechat)
router.post("/deletchat",verifytoken,messagecontrollers.deletchat)




module.exports = router;
