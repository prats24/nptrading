const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    brokerName:{
        type: String,
        required: true
    },
    accountId:{
        type: String,
        required : true
    },
    accountName:{
        type: String,
        required : true
    },
    apiKey:{
        type: String,
        required : true
    },
    apiSecret:{
        type: String,
        required : true
    },
    status:{
        type: String,
        required : true
    },
    uId:{
        type: String,
        required : true
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
    }
})

const accountDetail = mongoose.model("trading-account", accountSchema);
module.exports = accountDetail;