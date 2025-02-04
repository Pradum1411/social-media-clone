const jwt = require("jsonwebtoken")

isToken = async (req, res, next) => {
    try {
        console.log("error",process.env.TOKEN_KEY)
        jwt.verify(req.session.token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.redirect("/login")
            }
            req.session.user= decoded
           next()
        });
    } catch (error) {
        console.log("error---",error)
        return res.redirect("/login")
    }
}

module.exports=isToken