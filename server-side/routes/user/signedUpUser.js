const emailService = require("../../utils/emailService")
const otpGenerator = require('otp-generator')
const express = require("express");
const router = express.Router();
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");
const User = require("../../models/User/userDetailSchema");
const userPersonalDetail = require("../../models/User/userDetailSchema");
const signedUpUser = require("../../models/User/signedUpUser");
const sendSMS = require('../../utils/smsService');

router.post("/signup", async (req, res)=>{
    console.log("Inside SignUp Routes")
    const {first_name, last_name, email, mobile } = req.body;
    console.log(req.body)
    console.log(!first_name || !last_name || !email || !mobile)
    if( !first_name || !last_name || !email || !mobile){
        return res.status(422).json({error : "Plz fill all the details to proceed"})
    }

    const signedupuser = await SignedUpUser.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    try{
    if(signedupuser)
    {
        signedupuser.email_otp = email_otp;
        signedupuser.first_name = first_name;
        signedupuser.last_name = last_name;
        signedupuser.mobile = mobile;
        signedupuser.email = email;
        signedupuser.mobile_otp = mobile_otp;
        await signedupuser.save({validateBeforeSave:false})
    }
    else{
        await SignedUpUser.create({first_name:first_name, last_name:last_name, email:email, 
            mobile:mobile, email_otp:email_otp, mobile_otp: mobile_otp});
    }

    res.status(201).json({message : "Mobile and mail OTPs have been sent. Check your email and messages. OTPs expire in 30 minutes.", 
        status: 201});
                let subject = "OTP from ninepointer";
                let message = 
                `
                <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Email OTP</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                            line-height: 1.5;
                            margin: 0;
                            padding: 0;
                        }
    
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                        }
    
                        h1 {
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
    
                        p {
                            margin: 0 0 20px;
                        }
    
                        .otp-code {
                            display: inline-block;
                            background-color: #f5f5f5;
                            padding: 10px;
                            font-size: 20px;
                            font-weight: bold;
                            border-radius: 5px;
                            margin-right: 10px;
                        }
    
                        .cta-button {
                            display: inline-block;
                            background-color: #007bff;
                            color: #fff;
                            padding: 10px 20px;
                            font-size: 18px;
                            font-weight: bold;
                            text-decoration: none;
                            border-radius: 5px;
                        }
    
                        .cta-button:hover {
                            background-color: #0069d9;
                        }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                        <h1>Email OTP</h1>
                        <p>Hello ${first_name},</p>
                        <p>Your OTP code is: <span class="otp-code">${email_otp}</span></p>
                        <p>Please use this code to verify your email address and complete your registration.</p>
                        <p>If you did not request this OTP, please ignore this email.</p>
                        </div>
                    </body>
                    </html>
                `;

                emailService(email,subject,message);
                sendSMS([mobile.toString()], `Welcome to ninepointer. Your OTP for signup is ${mobile_otp}`);
            }catch(err){console.log(err);res.status(500).json({message:'Something went wrong',status:"error"})}
})

router.patch("/verifyotp", async (req, res)=>{
        const {
        first_name,
        last_name,
        email,
        email_otp,
        mobile,
        mobile_otp,
        referrerCode,
        } = req.body

    console.log("OTP Verification")
    console.log("Request Body in OTP Verification: ",req.body)

    const user = await SignedUpUser.findOne({email: email})
    console.log("Signed Up User: ",user)
    if(!user)
    {   
        console.log("Inside email check")
        return res.status(404).json({
            message: "User with this email doesn't exist"
        })
    }
    if(user.email_otp != email_otp || user.mobile_otp != mobile_otp)
    {   
        console.log("Inside OTP Matching")
        return res.status(404).json({
            message: "OTPs don't match, please try again!"
        })
    }
       

        User.findOne({ $or: [{ email: email }, { mobile: mobile }] })
        .then( async (dataExist)=>{
        if(dataExist){
            console.log(dataExist)
            console.log("data already exists");
            return res.status(422).json({message : "You already have an account, please login using your email id."})
        }

        //Check for referrer code
        console.log("Referrer Code: ",referrerCode,!referrerCode)
        if(!referrerCode){
            console.log("Inside Referrer Code Empty Check")
            return res.status(404).json({message : "No referrer code. Please enter your referrer code"});
        }

        const referrerCodeMatch = await User.findOne({myReferralCode: referrerCode});
        console.log("Referrer Code Match: ",referrerCodeMatch)

        if(!referrerCodeMatch){
            return res.status(404).json({message : "No such referrer code. Please enter a valid referrer code"});
        }

        console.log("OTP & Referral Code Verified")
        user.status = 'OTP Verified'
        user.last_modifiedOn = new Date()
        await user.save();
        // res.status(200).json({
        //     message: "OTP verification done"
        // })

        const referredBy = referrerCodeMatch._id;
            async function generateUniqueReferralCode() {
            const length = 8; // change this to modify the length of the referral code
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let myReferralCode = '';
            let codeExists = true;

            // Keep generating new codes until a unique one is found
            while (codeExists) {
                for (let i = 0; i < length; i++) {
                    myReferralCode += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                // Check if the generated code already exists in the database
                const existingCode = await User.findOne({ myReferralCode: myReferralCode });
                if (!existingCode) {
                codeExists = false;
                }
            }

            return myReferralCode;
            }

        
        const myReferralCode = generateUniqueReferralCode();
        const count = await User.countDocuments();
        console.log("Count of Documents: ",count)
        const userId = email.split('@')[0]
        const userIds = await User.find({employeeid:userId})
        console.log("User Ids: ",userIds)
        if(userIds.length > 0)
        {
             console.log("Inside User Id check for multiple users with same email initial")
             userId = userId.toString()+(userIds.length+1).toString()
             console.log(userId)
        }
        
        console.log("user Id(Line 204): ",userId)

        try{
        const newuser = await User.create({
            first_name, last_name, designation: 'Equity Trader', email, 
            mobile,
            role: 'user', 
            createdBy: first_name + ' ' + last_name,last_modifiedBy: first_name + ' ' + last_name, 
            name: first_name + ' ' + last_name.substring(0,1), createdOn: user.last_modifiedOn, 
            lastModified: user.last_modifiedOn, password: 'np' + last_name + '@123', status: 'Active', 
            employeeid: userId,fund: 0, creationProcess: 'Auto SignUp',
            joining_date:user.last_modifiedOn,myReferralCode:(await myReferralCode).toString(), referrerCode:referrerCode,
            referredBy: referredBy
        });

        if(!newuser) return res.status(400).json({message: 'Something went wrong'});

        res.status(201).json({status: "Success", data:newuser, message:"Welcome! Your account is created, please check your email for your userid and password details."});
            // let email = newuser.email;
            let subject = "Account Created - ninepointer";
            let message = 
            `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Created</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                    }

                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }

                    p {
                        margin: 0 0 20px;
                    }

                    .userid {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }

                    .password {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }

                    .login-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        font-size: 18px;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 5px;
                    }

                    .login-button:hover {
                        background-color: #0069d9;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <h1>Account Created</h1>
                    <p>Hello ${newuser.first_name},</p>
                    <p>Your login details are:</p>
                    <p>User ID: <span class="userid">${newuser.email}</span></p>
                    <p>Password: <span class="password">np${last_name}@123</span></p>
                    <p>Please use these credentials to log in to our website:</p>
                    <a href="https://www.ninepointer.in/" class="login-button">Log In</a>
                    </div>
                </body>
                </html>

            `
            emailService(newuser.email,subject,message);
        }
        catch(error){
            throw new Error(error);
        }
        

        })

        
})

router.patch("/resendotp", async (req, res)=>{
    const {email, mobile, type} = req.body
    const user = await SignedUpUser.findOne({email: email})
    if(!user)
    {
        return res.status(404).json({
            message: "User with this email doesnt exist"
        })
    }
    let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    let subject = "OTP from ninepointer";
    let message = `Your OTP for email verification is: ${email_otp}`
    if(type == 'mobile'){
        user.mobile_otp = mobile_otp;
        sendSMS([mobile.toString()],`Your otp for ninepointer signup is ${mobile_otp}`);    
    }
    else if(type == 'email'){
        user.email_otp = email_otp;
        emailService(email,subject,message);
    }    
    await user.save();
    res.status(200).json({
            message: "OTP Resent. Please check again."
    });
});

router.get("/signedupusers", (req, res)=>{
    SignedUpUser.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.put("/updatesignedupuser/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);

    try{
        const {id} = req.params
        //console.log(id)

        const signedupuser = await SignedUpUser.findOne({_id: id})
        //console.log("user", user)
        signedupuser.status = req.body.Status,

        await signedupuser.save();
        res.status(201).json({message : "data edit succesfully"});

    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

module.exports = router;