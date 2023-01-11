const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");

const Authenticate = async (req, res, next)=>{
    console.log("inside auth");
    try{
        console.log("this is cookies ",req.cookies);
        // console.log("this is something", req);

        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({_id: verifyToken._id});
        console.log("token and verifyToken", token, verifyToken);

        if(!user){ throw new Error("User not found")}

        req.token = token;
        req.user = user;

    } catch(err){
        res.status(401).send("Unauthorised")
        console.log(err);
    }
    next();
}

module.exports = Authenticate;