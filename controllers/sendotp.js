const nodemailer=require("nodemailer")
let mail=async(req,res,next)=>{
   
    try {
        let otp=Math.floor(100000 + Math.random() * 900000).toString();
        let trnaspoter= await nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            security:false,
            auth:{
                user:process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        let mailoption=await ({
            from:"<pradum43434.1123kumar@gmail.com>",
            to:req.body.email,
            subject:"Reset Password",
            text:"otp",
            html:`<h1>hi,</h1><br>
            <h3>verification code is--<h1>${otp}</h1></h3>
                <h3>if you did not request this, please ignore this email</h3><br><br>
                <h3>Thanks</h3>`
        })
       
        await trnaspoter.sendMail(mailoption,(err,info)=>{
            if(err){
                // res.send(err)
                console.log("otp error---",err)
                req.flash("error","otp sending failed")
                next()
            }
            // res.send(info)
            req.session.otp=otp
            req.session.email=req.body.email
            req.flash("error","otp sending successfully..")
            // console.log("otp success---",info)
            
            next()
        })
        
    } catch (error) {
        console.log("otp error--",error)
    
        next()
    }

}

module.exports=mail