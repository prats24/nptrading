//import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const Schema = require("mongoose");

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
        default: Date.now(),
        // required : true
    },
    createdBy:{
        type: String,
        // ref: 'User',
        // required : true
    },
    lastModifiedOn:{
        type: Date,
        default: Date.now(),
        // required : true
    },
    lastModifiedBy:{
        type: String,
        // ref: 'User',
        // required : true
    },
    isDeleted:{
        type: Boolean,
        default: false,
        // required : true
    },
    userId:{
        type: String,
    },
    transactionId: {
        type: String
    }

})

marginSchema.pre('save', async function(next){
    if(!this.transactionId|| this.isNew){
        const count = await marginDetail.countDocuments();
        const tId = "NPT" + (count + 1).toString().padStart(8, "0");
        this.transactionId = tId;
        next();
    }
    next();
})

const marginDetail = mongoose.model("trader-fund", marginSchema);
module.exports = marginDetail;
