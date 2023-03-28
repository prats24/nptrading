const emailService = require("../../utils/emailService")
const otpGenerator = require('otp-generator')
const express = require("express");
const router = express.Router();
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");
const User = require("../../models/User/userDetailSchema");
const userPersonalDetail = require("../../models/User/userDetailSchema");

router.post("/signup", (req, res)=>{
    console.log("Inside SignUp Routes")
    const {first_name, last_name, email, mobile, dob, gender, trading_exp, city, state, country, employeed, purpose_of_joining, terms_and_conditions, trading_account, pincode, referrerCode } = req.body;
    console.log(req.body)
    console.log(!first_name || !last_name || !email || !mobile || !dob || !gender || !trading_exp || !city || !state || !country || !terms_and_conditions || !purpose_of_joining || !trading_account || !pincode || !referrerCode)
    if( !first_name || !last_name || !email || !mobile || !dob || !gender || !trading_exp || !city || !state || !country || !terms_and_conditions || !purpose_of_joining || !trading_account || !pincode || !referrerCode){
        return res.status(422).json({error : "Plz fill all the details to proceed"})
    }

    SignedUpUser.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    .then((dataExist)=>{
        if(dataExist){
            console.log("data already");
            return res.status(422).json({error : "Already signed up"})
        }
        
        let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
        const signedUser = new SignedUpUser({
            first_name, last_name, email, 
            mobile, dob, gender, trading_exp, 
            city, state, country, employeed, 
            purpose_of_joining, terms_and_conditions, 
            email_otp, trading_account, pincode,
            referrerCode,
        });
        console.log(signedUser)
        signedUser.save().then(()=>{
            res.status(201).json({message : "Data enter succesfully", status: 201});
            let email = signedUser.email;
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
        }).catch((err)=> res.status(500).json({error: err}));
    }).catch(err => {console.log(err)});
})


router.patch("/verifyotp", async (req, res)=>{
        const {
        first_name, 
        last_name, 
        email, 
        mobile, 
        dob, 
        gender, 
        trading_exp, 
        city, 
        state, 
        country, 
        employeed, 
        purpose_of_joining, 
        email_otp,
        trading_account,
        pincode,
        referrerCode,
        } = req.body

    console.log("OTP Verification")
    console.log("Request Body in OTP Verification: ",req.body)

    const user = await SignedUpUser.findOne({email: email})
    if(!user)
    {
        return res.status(404).json({
            message: "User with this email doesn't exist"
        })
    }
    if(user.email_otp != email_otp)
    {
        return res.status(404).json({
            message: "OTP doesn't match, please try again!"
        })
    }
        user.status = 'OTP Verified'
        user.last_modifiedOn = new Date()
        await user.save();
        // res.status(200).json({
        //     message: "OTP verification done"
        // })

        User.findOne({ $or: [{ email: email }, { mobile: mobile }] })
        .then( async (dataExist)=>{
        if(dataExist){
            console.log(dataExist)
            console.log("data already exists");
            return res.status(422).json({error : "Already a User"})
        }

        //Check for referrer code

        if(!referrerCode){
            return res.status(404).json({error : "No referrer code. Please enter your referrer code"});
        }

        const referrerCodeMatch = await User.findOne({myReferralCode: referrerCode});

        if(!referrerCodeMatch){
            return res.status(404).json({error : "No such referrer code. Please enter a valid referrer code"});
        }

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
        const userId = "NP" + (count + 1).toString().padStart(8, "0");
        console.log("ninepointer Id: ",userId)

        try{
        const newuser = await User.create({
            first_name, last_name, designation: 'Equity Trader', email, 
            mobile, dob, gender, trading_exp, city, state, 
            country, employeed, purpose_of_joining, trading_account, role: 'user', 
            createdBy: first_name + ' ' + last_name,last_modifiedBy: first_name + ' ' + last_name, 
            name: first_name + ' ' + last_name.substring(0,1), createdOn: user.last_modifiedOn, 
            lastModified: user.last_modifiedOn, password: 'np' + last_name + '@123', status: 'Active', 
            employeeid: userId,fund: 0, location: city, creationProcess: 'Auto SignUp',
            joining_date:user.last_modifiedOn,myReferralCode:(await myReferralCode).toString(), pincode:pincode, referrerCode:referrerCode,
            referredBy: referredBy
        });

        if(!newuser) return next(console.log('Couldn\'t create user', 400));

        res.status(201).json({status: "Success", data:newuser, message:"Account Created"});
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
    const {email} = req.body
    const user = await SignedUpUser.findOne({email: email})
    if(!user)
    {
        return res.status(404).json({
            message: "User with this email doesnt exist"
        })
    }
    let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let subject = "OTP from ninepointer";
    let message = `Your OTP for email verification is: ${email_otp}`
    user.email_otp = email_otp
        await user.save();
        res.status(200).json({
            message: "OTP Resent"
        })
    emailService(email,subject,message);
})

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