const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const jwt = require("jsonwebtoken")
const authentication = require("../../authentication/authentication");
const sendSMS = require('../../utils/smsService');
const otpGenerator = require('otp-generator');

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
    //console.log(userLogin);
    if(!userLogin || !(await userLogin.correctPassword(pass, userLogin.password))){
        return res.status(422).json({error : "invalid details"})
    }else{
    
     //REMINDER ---> HAVE TO FIX ACCORDING ABOVE COMMENTED CODE.
        if(!userLogin ){
            return res.status(422).json({error : "invalid details"})
        }else{
        
        const token = await userLogin.generateAuthToken();
        //console.log(token);
        
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });
        // res.json(token);
        res.status(201).json({massage : "user login succesfully"});
    }
}
})

router.post('/phonelogin', async (req,res, next)=>{
    const {mobile} = req.body;
    try{
        const user = await UserDetail.findOne({mobile});
    
        if(!user){
            return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'})
        }
        console.log(user);
    
        let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    
        user.mobile_otp = mobile_otp;
        console.log(user);
        await user.save({validateBeforeSave: false});
    
        sendSMS([mobile.toString()], `Your otp to login to ninepointer is: ${mobile_otp}`);
    
        res.status(200).json({status: 'Success', message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.`});
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: `Something went wrong. Please try again.`});
    }

});

router.post('/verifyphonelogin', async(req,res,next)=>{
    const {mobile, mobile_otp} = req.body;

    try {
        const user = await UserDetail.findOne({mobile});
        if(!user){
            return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'});
        }

        console.log(user);

        if(user.mobile_otp != mobile_otp){
            console.log(user.mobile_otp, mobile_otp);
            return res.status(400).json({status: 'error', message: 'OTP didn\'t match. Please check again.'});
        }

        const token = await user.generateAuthToken();

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });
        // res.json(token);
        res.status(200).json({status: 'success', message : "User login successful", token: token});


    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', message: `Something went wrong. Please try again.`});
    }

});

router.post("/resendmobileotp", async(req, res)=>{
    const{mobile} = req.body;
    try{
        const user = await UserDetail.findOne({mobile});
        if(!user){
            return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'});
        }
        let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        
        user.mobile_otp = mobile_otp;
        await user.save({validateBeforeSave: false});
    
        sendSMS([mobile.toString()], `Your OTP is ${mobile_otp}`);
        res.status(200).json({status: 'success', message : "Otp sent. Check again."});
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: `Something went wrong. Please try again.`});

    }
});

router.get("/loginDetail", authentication, (req, res)=>{
    //console.log("hello my about", req.user);
    // res.json({message: "data"});
    res.json(req.user);
})

router.get("/logout", authentication, (req, res)=>{
    res.clearCookie("jwtoken", { path: "/" });
    res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
    // //console.log("hello my about", req.user);
    // res.json({message: "data"});
    // res.json(req.user);
})


module.exports = router;