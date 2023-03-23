const express = require("express");
const router = express.Router();
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");
const authController = require("../../controllers/authController")

router.post("/signup", (req, res)=>{
    console.log("Inside SignUp Routes")
    const {first_name, last_name, applying_for,address, family_yearly_income, email, mobile, watsApp_number, degree, dob, gender, trading_exp, city, state, country, last_occupation, employeed, purpose_of_joining, terms_and_conditions } = req.body;
    console.log(req.body)
    if( !first_name || !last_name || !email || !applying_for || !mobile || !watsApp_number || !degree || !dob || !gender || !trading_exp || !city || !state || !country || !last_occupation || !terms_and_conditions || !purpose_of_joining){
        return res.status(422).json({error : "Plz fill all the details to proceed"})
    }

    SignedUpUser.findOne({ $or: [{ email: email }, { mobile: mobile }, { watsApp_number: watsApp_number }] })
    .then((dataExist)=>{
        if(dataExist){
            console.log("data already");
            return res.status(422).json({error : "Already signed up"})
        }
        const signedUser = new SignedUpUser({first_name, last_name, applying_for,address, family_yearly_income, email, mobile, watsApp_number, degree, dob, gender, trading_exp, city, state, country, last_occupation, employeed, purpose_of_joining, terms_and_conditions});
        console.log(signedUser)
        signedUser.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({err}));
    }).catch(err => {console.log(err)});
})

module.exports = router;