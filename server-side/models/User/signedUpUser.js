const mongoose = require("mongoose");

const signedUpUserSchema = new mongoose.Schema({

    first_name:{
        type: String,
        required : true
    },
    last_name:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    watsApp_number:{
        type: String,
        required: true
    },
    degree:{
        type: String,
        required: true
    },
    dob:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    purpose_of_joining:{
        type: String,
        required: true
    },
    trading_exp:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    last_occupation:{
        type: String,
        required: true
    },
    employeed:{
        type: Boolean,
        default: false,
        required: true,
    },
    applying_for:{
        type: String,
        required: true,
    },
    mobile_otp:{
        type: String,
        // required: true
    },
    email_otp:{
        type: String,
        // required: true
    },
    family_yearly_income:{
        type: String,
        required: true
    },
    terms_and_condition:{
        type: Boolean,
        default: false,
        required: true,
    },
    status:{
        type: String,
        enum: ['OTP Verification Pending','OTP Verified','Approved','Rejected'],
        default:'OTP Verification Pending'
    },
  
})



const signedUpUser = mongoose.model("signedup_user", signedUpUserSchema);
module.exports = signedUpUser;

