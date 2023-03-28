const mongoose = require("mongoose");

const signedUpUserSchema = new mongoose.Schema({

    first_name:{
        type: String,
        required : true
    },
    createdOn:{
        type: Date,
        required: true,
        default: new Date(),
    },
    last_modifiedOn:{
        type: Date,
        required: true,
        default: new Date(),
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
    employeed:{
        type: Boolean,
        default: false,
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
    trading_account:{
        type: String,
        enum: ['Zerodha','Upstox','PayTM Money','Trading View','Groww','I don\'t have any trading account','Other'],
        // default:'OTP Verification Pending'
    },
    referrerCode:{
        type: String,
    }
  
})



const signedUpUser = mongoose.model("signedup_user", signedUpUserSchema);
module.exports = signedUpUser;

