const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const uniqid = require("uniqid");
const { Schema } = mongoose;


const userDetailSchema = new mongoose.Schema({
    status:{
        type: String,
        required: true
    },
    uId:{
        type: String,
        required : true,
        default: uniqid(),
    },
    createdOn:{
        type: String,
        required : true
    },
    lastModified:{
        type: String,
        required : true
    },
    createdBy:{
        type: String,
        required : true
    },
    name:{
        type: String,
        required : true
    },
    first_name:{
        type: String,
        required : true
    },
    last_name:{
        type: String,
        required : true
    },
    cohort:{
        type: String,
        // required : true
    },
    designation:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    mobile_otp:{
        type: String,
    },
    whatsApp_number:{
        type: String,
        // required: true
    },
    degree:{
        type: String,
        // required: true
    },
    dob:{
        type: String,
        // required: true
    },
    gender:{
        type: String,
        // required: true
    },
    address:{
        type: String,
        // required: true
    },
    trading_exp:{
        type: String,
        // required: true
    },
    location:{
        type: String,
        // required: true
    },
    city:{
        type: String,
        // required: true
    },
    state:{
        type: String,
        // required: true
    },
    country:{
        type: String,
        // required: true
    },
    last_occupation:{
        type: String,
        // required: true
    },
    family_yearly_income:{
        type: String,
        // require: true,
    },
    joining_date:{
        type: String,
    },
    purpose_of_joining:{
        type: String,
    },
    employeed:{
        type: Boolean,
        // required: true,
    },
    role:{
        type: String,
        required: true
    },
    creationProcess:{
        type: String,
        required: true,
        enum: ['Auto SignUp','By Admin']
    },
    employeeid:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        // required: true
    },
    upiId:{
        type: String,
        // required: true
    },
    googlePay_number:{
        type: String,
        // required: true
    },
    payTM_number:{
        type: String,
        // required: true
    },
    phonePe_number:{
        type: String,
        // required: true
    },
    bankName:{
        type: String,
        // required: true
    },
    nameAsPerBankAccount:{
        type: String,
        // required: true
    },
    accountNumber:{
        type: String,
        // required: true
    },
    ifscCode:{
        type: String,
        // required: true
    },
    password:{
        type: String,
        // required: true
    },
    resetPasswordOTP:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date,
    },
    passwordChangedAt:{
        type: String,
        // required: true
    },
    watchlistInstruments: [
        {
            type: Schema.Types.ObjectId,
            ref: "instruments-details"
        }
        
    ],
    referralProgramme: 
        {
            type: Schema.Types.ObjectId,
            ref: "referral-program"
        }
        
    ,
    userId: {
        type: String,
              
    },
    fund: {
        type: Number,      
    },
    aadhaarNumber:{
        type: String,
    },
    panNumber:{
        type: String,
    },
    drivingLicenseNumber:{
        type: String,
    },
    passportNumber:{
        type: String,
    },
    aadhaarCardFrontImage:{url:String,name:String},
    aadhaarCardBackImage:{url:String,name:String},
    panCardFrontImage:{url:String,name:String},
    passportPhoto:{url:String,name:String},
    addressProofDocument:{url:String,name:String},
    incomeProofDocument:{url:String,name:String},
    profilePhoto:{url:String,name:String},
    KYCStatus:{
        type: String,
        enum: ['Not Initiated','Submitted','Approved','Rejected','Under Verification'],
        default: 'Not Initiated',
    },
    myReferralCode:{
        type: String,
    },
    referrerCode:{
        type: String,
    },
    referredBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    contests:[{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }],
    isAlgoTrader:{
        type: Boolean,
        default: false
    },

})

//Adding the ninepointer id before saving
userDetailSchema.pre('save', async function(next){
    console.log("inside employee id generator code")
    if(!this.employeeid || this.isNew){
        const count = await this.constructor.countDocuments();
        console.log("Count of Documents: ",count)
        const userId = this.email.split('@')[0]
        const userIds = await userPersonalDetail.find({employeeid:userId})
        if(userIds.length > 0)
        {
             userId = userId.toString()+(userIds.length+1).toString()
        }
        this.employeeid = userId;
        next();
    } else {
        next();
    }
});

userDetailSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        return next();
    } 
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userDetailSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

// generating jwt token
userDetailSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        // this.tokens = this.tokens.concat({token: token});
        return token;
    } catch (err){
        console.log(err, "err in userDetailSchema");
    }
}

const userPersonalDetail = mongoose.model("user-personal-detail", userDetailSchema);
module.exports = userPersonalDetail;

