const emailService = require("../../utils/emailService")
const otpGenerator = require('otp-generator')
const express = require("express");
const router = express.Router();
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");

router.post("/signup", (req, res)=>{
    console.log("Inside SignUp Routes")
    const {first_name, last_name, applying_for,address, family_yearly_income, email, mobile, watsApp_number, degree, dob, gender, trading_exp, city, state, country, last_occupation, employeed, purpose_of_joining, terms_and_conditions, trading_account } = req.body;
    console.log(req.body)
    if( !first_name || !last_name || !email || !applying_for || !mobile || !watsApp_number || !degree || !dob || !gender || !trading_exp || !city || !state || !country || !last_occupation || !terms_and_conditions || !purpose_of_joining || !trading_account){
        return res.status(422).json({error : "Plz fill all the details to proceed"})
    }

    SignedUpUser.findOne({ $or: [{ email: email }, { mobile: mobile }, { watsApp_number: watsApp_number }] })
    .then((dataExist)=>{
        if(dataExist){
            console.log("data already");
            return res.status(422).json({error : "Already signed up"})
        }
        
        let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
        const signedUser = new SignedUpUser({
            first_name, last_name, applying_for,address, family_yearly_income, email, 
            mobile, watsApp_number, degree, dob, gender, trading_exp, city, state, 
            country, last_occupation, employeed, purpose_of_joining, terms_and_conditions, email_otp, trading_account
        });
        console.log(signedUser)
        signedUser.save().then(()=>{
            res.status(201).json({massage : "Data enter succesfully"});
            let email = signedUser.email;
            let subject = "OTP from ninepointer";
            let message = `Your OTP for email verification is: ${email_otp}`
            emailService(email,subject,message);
        }).catch((err)=> res.status(500).json({err}));
    }).catch(err => {console.log(err)});
})


router.patch("/verifyotp", async (req, res)=>{
        const {
        first_name, 
        last_name, 
        designation, 
        address, 
        family_yearly_income, 
        email, 
        mobile, 
        watsApp_number, 
        degree, 
        dob, 
        gender, 
        trading_exp, 
        city, 
        state, 
        country, 
        last_occupation, 
        employeed, 
        purpose_of_joining, 
        email_otp,
        } = req.body

    console.log("OTP Verification")

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
        await user.save();
        res.status(200).json({
            message: "OTP verification done"
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