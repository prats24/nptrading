//import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const Schema = require("mongoose");
let date = new Date();

const marginSchema = new mongoose.Schema({

    amount:{
        type: Number,
        required : true
    },
    uId:{
        type: String,
        // required : true
    },
    createdOn:{
        type: Date,
        default: new Date()
        // required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    lastModifiedOn:{
        type: Date,
        default: new Date()
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    isDeleted:{
        type: Boolean,
        default: false,
        // required : true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    traderName:{
        type: String,
        //required: true,
    },
    transactionId: {
        type: String
    },
    fund: {
        type: Number
    },
    creditedOn:{
        type: Date,
        default: new Date()
        // required : true
    },
    creditedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },

})

marginSchema.pre('save', async function(next){
    if(!this.transactionId|| this.isNew){
        const count = await marginDetail.countDocuments();
        const tId = "SHMA" + (count + 1).toString().padStart(8, "0");
        this.transactionId = tId;
        next();
    }
    next();
})

const marginDetail = mongoose.model("trader-fund", marginSchema);
module.exports = marginDetail;
