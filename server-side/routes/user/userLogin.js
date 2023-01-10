const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const jwt = require("jsonwebtoken")
const authentication = require("../../authentication/authentication")

router.post("/login", async (req, res)=>{
    const {userId, pass} = req.body;

    if(!userId || !pass){
        console.log("data nhi h pura");
        return res.status(422).json({error : "please fill all the field..."})
    }
    if(pass !== "DMT"){
        return res.status(422).json({error : "invalid details"})
    }

    // if(pass !== process.env.PASSWORD){
    //     return res.status(422).json({error : "invalid details"})
    // }

    const userLogin = await UserDetail.findOne({email : userId})
    console.log(userLogin);
    if(!userLogin){
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
})

router.get("/companyposition", authentication, (req, res)=>{
    console.log("hello my about");
    res.send(req.user);
})


module.exports = router;