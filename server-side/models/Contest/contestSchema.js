const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestSchema = new mongoose.Schema({
    contestName:{
        type: String,
        required: true
    },
    contestStartDate:{
        type: Date,
        required: true
    },
    contestEndDate:{
        type:Date,
        required: true
    },
    contestMargin: Number,
    entryOpeningDate:{
        type:Date,
        required: true
    },
    entryClosingDate:{
        type:Date,
        required: true
    },
    stockType:{
        type:String,
        required:true,
        enum: ['Options','Futures','Equity','Derivative','Currency','Crypto']
    },
    contestOn:{
        type:String,
        required:true
    },
    rewards:{
        type:[{rankStart:Number,rankEnd:Number,rankIcon:String,reward:Number,currency:String}],
        required:true
    },
    contestRule:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'contest-rule'
    },
    entryFee:{
        amount:Number,
        currency:{type:String,enum:['INR','CREDOS']}
    },
    participants:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        registeredOn:{type:Date},
        paymentId:{type:Schema.Types.ObjectId, ref: 'contest-payment'},
        portfolioId:{type:Schema.Types.ObjectId, ref: 'user-portfolio'},
        status:{type:String, enum:['Joined','Exited']},
        exitDate:{type:Date, default: new Date()},

    }],
    instruments:[{
        displayName:String,
        instrumentSymbol:String,
        instrumentToken:Number,
        exchange:String,
        addedOn: {type:Date,default:new Date()},
        addedby: {type:Schema.Types.ObjectId,ref:'user-personal-detail'},
        lastModifiedOn: {type:Date,default:new Date()},
        lastModifiedBy: {type:Schema.Types.ObjectId,ref:'user-personal-detail'},
    }],
    maxParticipants:{
        type:Number,
        required: true
    },
    minParticipants:{
        type:Number,
        required: true
    },
    status:{
        type:String,
        required: true,
        enum: ['Live','Not Live','Cancelled']
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

const contestData = mongoose.model("contest", contestSchema);
module.exports = contestData;