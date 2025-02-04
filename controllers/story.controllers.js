var cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});
const storymodel = require("../model/story.model")

class Story {
    static async savestroy(req, res, next) {
        try {


            const file = req.files.story
            // console.log("files--",req.body,file)
            let _id = req.session.user.userId
            const result = await cloudinary.uploader.upload((file.tempFilePath))
             let storydata=await storymodel({
                storyuserid: _id,
                story: result.secure_url
            })
            await storydata.save()
            console.log("kk", storydata)
            res.redirect("/")

        } catch (error) {
            console.log("story", error)
            res.redirect("/")
        }
    }

    static async removestory(req,res,next){
        let _id=req.params.id
        await storymodel.findByIdAndDelete({_id})

        res.send({id:_id})
    }
}
module.exports = Story