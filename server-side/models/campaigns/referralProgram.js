const mongoose = require("mongoose");
const { Schema } = mongoose;

const referralProgramSchema = new mongoose.Schema({
    referrralProgramId:{
        type: String,
        required: true
    },
    referrralProgramName:{
        type: String,
        required: true
    },
    referralProgramStartDate:{
        type: Date,
        required: true
    },
    referralProgramEndDate:{
        type:Date,
        required: true
    },
    rewardPerReferral:{
        type:Number,
        required: true
    },
    currency:{
        type:String,
        required: true,
        enum: ['INR','CREDOS']
    },
    budget:{
        type:Number,
        required: true
    },
    termsAndConditions:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    performanceMetrics:{
        impressions: { type: Number, required: true },
        clicks: { type: Number, required: true },
    },
    status:{
        type:String,
        required: true,
        enum: ['Active','Paused','Completed']
    },
    createdOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
})

const referralProgramData = mongoose.model("referral-program", referralProgramSchema);
module.exports = referralProgramData;