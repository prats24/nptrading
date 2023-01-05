const mongoose = require("mongoose");

const tradingAlgoSchema = new mongoose.Schema({
    algoName:{
        type: String,
        required: true
    },
    transactionChange:{
        type: String,
        required : true
    },
    instrumentChange:{
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
    },
    exchangeChange:{
        type: String,
        required : true
    },
    lotMultipler:{
        type: String,
        required : true
    },
    productChange:{
        type: String,
        required : true
    },
    tradingAccount:{
        type: String,
        required : true
    },
    isRealTrade:{
        type: Boolean,
        required : true
    }
})

const tradingAlgoDetail = mongoose.model("algo-trading", tradingAlgoSchema);
module.exports = tradingAlgoDetail;