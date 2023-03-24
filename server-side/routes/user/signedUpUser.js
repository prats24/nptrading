const emailService = require("../../utils/emailService")
const otpGenerator = require('otp-generator')
const express = require("express");
const router = express.Router();
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");
const User = require("../../models/User/userDetailSchema");

router.post("/signup", (req, res)=>{
    console.log("Inside SignUp Routes")
    const {first_name, last_name, applying_for,address, family_yearly_income, email, mobile, watsApp_number, degree, dob, gender, trading_exp, city, state, country, last_occupation, employeed, purpose_of_joining, terms_and_conditions, trading_account } = req.body;
    console.log(req.body)
    console.log(!first_name || !last_name || !email || !applying_for || !mobile || !watsApp_number || !degree || !dob || !gender || !trading_exp || !city || !state || !country || !last_occupation || !terms_and_conditions || !purpose_of_joining || !trading_account)
    if( !first_name || !last_name || !email || !applying_for || !mobile || !watsApp_number || !degree || !dob || !gender || !trading_exp || !city || !state || !country || !last_occupation || !terms_and_conditions || !purpose_of_joining || !trading_account){
        return res.status(422).json({message : "Plz fill all the details to proceed"})
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
            res.status(201).json({message : "Data enter succesfully"});
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
        applying_for, 
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
        trading_account,
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
        //  const newuser = new User({
        //     first_name, last_name, designation: applying_for,address: address, family_yearly_income, email, 
        //     mobile, whatsApp_number: watsApp_number, degree, dob, gender, trading_exp, city, state, 
        //     country, last_occupation, employeed, purpose_of_joining, trading_account, role: 'user', 
        //     createdBy: first_name + ' ' + last_name,last_modifiedBy: first_name + ' ' + last_name, 
        //     name: first_name + ' ' + last_name.substring(0,1), createdOn: user.last_modifiedOn, 
        //     lastModified: user.last_modifiedOn, password: 'np' + last_name + '@123', status: 'Active',

        // });
        // console.log("New User: ",newuser);

        const count = await User.countDocuments();
        console.log("Count of Documents: ",count)
        const userId = "NP" + (count + 1).toString().padStart(8, "0");
        console.log("ninepointer Id: ",userId)

        try{
        const newuser = await User.create({
            first_name, last_name, designation: applying_for,address: address, family_yearly_income, email, 
            mobile, whatsApp_number: watsApp_number, degree, dob, gender, trading_exp, city, state, 
            country, last_occupation, employeed, purpose_of_joining, trading_account, role: 'user', 
            createdBy: first_name + ' ' + last_name,last_modifiedBy: first_name + ' ' + last_name, 
            name: first_name + ' ' + last_name.substring(0,1), createdOn: user.last_modifiedOn, 
            lastModified: user.last_modifiedOn, password: 'np' + last_name + '@123', status: 'Active', 
            employeeid: userId,fund: 0, location: city, creationProcess: 'Auto SignUp',joining_date:user.last_modifiedOn, 
        });

        if(!newuser) return next(console.log('Couldn\'t create user', 400));

        res.status(201).json({status: "Success", data:newuser, message:"User created succesfully"});
        }
        catch(error){
            throw new Error(error);
        }
        // await newuser.create().then(()=>{
        //     res.status(201).json({message : "User created succesfully"});
        // }).catch((err)=> res.status(500).json({err}));
        

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