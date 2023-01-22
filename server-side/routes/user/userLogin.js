const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const jwt = require("jsonwebtoken")
const authentication = require("../../authentication/authentication")

router.post("/login", async (req, res)=>{
    const {userId, pass} = req.body;

    if(!userId || !pass){
        return res.status(422).json({error : "please fill all the field..."})
    }

    //TODO --> hashing password and comparing
    // if(pass !== "DMT"){
    //     return res.status(422).json({error : "invalid details"})
    // }

    // if(pass !== process.env.PASSWORD){
    //     return res.status(422).json({error : "invalid details"})
    // }

    const userLogin = await UserDetail.findOne({email : userId})
    console.log(userLogin);
    if(!userLogin || !(await userLogin.correctPassword(pass, userLogin.password))){
        return res.status(422).json({error : "invalid details"})
    }else{
    
     //REMINDER ---> HAVE TO FIX ACCORDING ABOVE COMMENTED CODE.
        if(!userLogin ){
            return res.status(422).json({error : "invalid details"})
        }else{
        
        const token = await userLogin.generateAuthToken();
        console.log(token);
        
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });
        // res.json(token);
        res.status(201).json({massage : "user login succesfully"});
    }
}
})

router.get("/loginDetail", authentication, (req, res)=>{
    console.log("hello my about", req.user);
    // res.json({message: "data"});
    res.json(req.user);
})

router.get("/logout", authentication, (req, res)=>{
    res.clearCookie("jwtoken", { path: "/" });
    res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
    // console.log("hello my about", req.user);
    // res.json({message: "data"});
    // res.json(req.user);
})


module.exports = router;