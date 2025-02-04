const usermodel = require("../model/user.model")
const postmodel = require("../model/post.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const NodeCache = require("node-cache");
const myCache = new NodeCache();
var cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});

class userControllers {

    static async register(req, res, next) {
        try {
            let username = req.body.username
            let email = req.body.email[1]
            let password = req.body.password[1]
            console.log(username, email, password)
            const user = await usermodel.aggregate([{ $match: { $or: [{ username }, { email }] } }])
            console.log(user, user.length)
            if (user.length) {
                console.log("hhahahahha")
                req.flash("error", "username or email already register")
                return res.redirect("/login")
            }
            // hash password
            const salt = await bcrypt.genSalt(10)
            const hashpassword = await bcrypt.hash(password, salt)

            const userdata = await usermodel({
                username: username,
                email: email,
                password: hashpassword
            })
            await userdata.save()
            // generate token
            const token = await jwt.sign({ username: userdata.username, userId: userdata._id }, process.env.TOKEN_KEY, { expiresIn: "1d" })
            req.session.token = token
            req.flash("success", "Register Successfully..")
            // console.log(req.body)
            next()
        } catch (error) {
            req.flash("error", "registation failed")
            // console.log("controllers-register-",error.message)
            res.redirect("/login")
        }

    }

    static async login(req, res, next) {
        try {
            let email = req.body.email[0]
            let password = req.body.password[0]
            const user = await usermodel.findOne({ $or: [{ email }, { username: email }] })
            if (!user) {
                req.flash("error", "user not found")
                return res.redirect("/login")
                // return res.status(404).send("usernot found")
            }

            const ismatch = await bcrypt.compare(password, user.password)
            if (!ismatch) {
                req.flash("error", "Incorrect username or password")
                return res.redirect("/login")
            }
            // console.log("gdfgdfgdf--",req.body,ismatch,process.env.TOKEN_KEY)
            const token = await jwt.sign({ username: user.username, userId: user._id }, process.env.TOKEN_KEY, { expiresIn: "1d" })
            // console.log("token---",token,process.env.TOKEN_KEY)
            req.session.token = token
            req.flash("success", "Login Successfully..")

            next()
            // res.send("login Successfully..")
        } catch (error) {
            req.flash("error", "Login Failed")
            // console.log("login-",error)
            res.redirect("/login")
            // res.status(400).send("error")
        }

    }
    static async logout(req, res, next) {
        try {
            await req.session.destroy()

            // console.log("logout--","logout")
            return res.redirect("/login")
        } catch (error) {
            console.log("logout--", error)
        }
    }

    static async reset_password(req, res, next) {
        try {
            // console.log(req.session)
            let email = req.body.email
            let password = req.body.password
            const user = await usermodel.findOne({
                $or: [{ email: email }, { username: email }]
            });
            if (!user) {
                req.flash("error", "user not found")
                return res.redirect("/resetpassword")
            }
            if (req.session.otp != req.body.otp) {
                req.flash("error", "otp not match")
                return res.redirect("/resetpassword")
            }
            const salt = await bcrypt.genSalt(10)
            const hashpassword = await bcrypt.hash(password, salt)
            await usermodel.updateOne({ $or: [{ username: email }, { email }] }, { password: hashpassword })
            user.save()
            req.flash("success", "Password Update Successfully")
            const token = await jwt.sign({ username: user.username, userId: user._id }, process.env.TOKEN_KEY, { expiresIn: "1d" })
            req.session.token = token
            res.redirect("/")
        } catch (error) {
            req.flash("error", "Wrong Credential")
            console.log("password reset error--", error)
            res.redirect("/resetpassword")
        }
    }

    static async createpost(req, res, next) {
        try {
            // console.log(req.body)
            const file = req.files.file
            // console.log(req.body,file)

            const result = await cloudinary.uploader.upload((file.tempFilePath))
            const postdata = await postmodel({
                caption: req.body.caption,
                image: result.secure_url,
                auther: req.session.user.userId
            })
            await postdata.save()
            await usermodel.findByIdAndUpdate(
                { _id: req.session.user.userId },
                { $push: { posts: postdata._id } }, // Push the new hobby into the array
                { new: true } // Return the updated document
            )

            req.flash("success", "Post Created Successfully..")
            // console.log("Upload successful:", result.secure_url);
            return res.redirect("/")
        } catch (error) {
            console.log("uplooad image error--", error)
            req.flash("error", "Post Not Created")
            return res.redirect("/")
        }
    }
    //get user profile
    static async getprofile(req, res, next) {
        try {
            // console.log(req.params.id)
            // let user;
            // if (myCache.has("user")) {
            //     user = myCache.get("user")
            // } else {
                let _id = req.session.user.userId
                let user = await usermodel.findOne({_id}).select("-password")
                // myCache.set("user", user)
            // }
            let userdata = await usermodel.findOne({ _id: req.params.id }).select("-password")
                .populate("posts")
                .populate("followers")
                .populate("following")
                .populate("bookmarks")

            console.log("--dd--d",user,userdata)
            return res.render("userprofile", ({ user, user1: userdata }))

        } catch (error) {
            console.log("get profile error--", error)
        }
    }
    // edit profile
    static async editprofile(req, res, next) {
        try {
            const file = req.files.file
            // console.log("files--",req.body,file)
            let _id = req.session.user.userId
            const result = await cloudinary.uploader.upload((file.tempFilePath))
            console.log("result--", result)
            let updateuserdata = await usermodel.findByIdAndUpdate(
                _id, // The ID of the document to update
                {
                    name: req.body.name,
                    bio: req.body.bio,
                    gender: req.body.gender,
                    profilePicture: result.secure_url,
                }, // Update fields in a single object
                { new: true } // Option to return the updated document
            );
            //   console.log("updateuserdata--",updateuserdata)
            req.flash("success", "Profile Update Successfully..")
            myCache.del("user")

            res.redirect("/")

        } catch (error) {
            console.log("edit profile error--", error)
            req.flash("error", "Profile Update Failed")
            res.redirect("/")
        }
    }

    static async following(req, res, next) {
        try {
            let loginnuser = await usermodel.findOne({ _id: req.session.user.userId })
            let otheruser = await usermodel.findOne({ _id: req.body.follow })
            if (!loginnuser || !otheruser) {
                console.log("following--", "uswer not find")
                res.send("user not found")
            }
            const isFollowing = await loginnuser.following.includes(otheruser)
            if (isFollowing) {
                await Promise.all([
                    user.updateOne({ _id: loginnuser._id }, { $pull: { following: otheruser } }),
                    user.updateOne({ _id: otheruser._id }, { $pull: { following: loginnuser } })
                ])
                res.send("unfollow successsfully")
            }
            else {
                await Promise.all([
                    user.updateOne({ _id: loginnuser._id }, { $push: { following: otheruser } }),
                    user.updateOne({ _id: otheruser._id }, { $push: { following: loginnuser } })
                ])
                res.send("follow successsfully")
            }

        } catch (error) {
            req.send("follow")
        }
    }
}

module.exports = userControllers