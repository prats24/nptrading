const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");

const Authenticate = async (req, res, next)=>{
    try{

        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({_id: verifyToken._id});

        if(!user){ throw new Error("User not found")}

        req.token = token;
        req.user = user;

    } catch(err){
        return res.status(401).send("Unauthenthicated")
    }
    next();
}

module.exports = Authenticate;