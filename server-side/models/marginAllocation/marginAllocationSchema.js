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
        type: String,
        default: `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
        // required : true
    },
    createdBy:{
        type: String,
        // ref: 'User',
        // required : true
    },
    lastModifiedOn:{
        type: String,
        default: `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
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
    traderName:{
        type: String,
        //required: true,
    },
    transactionId: {
        type: String
    },
    fund: {
        type: Number
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
