const mongoose = require("mongoose");

const brokerageSchema = new mongoose.Schema({
    brokerName:{
        type: String,
        required: true
    },
    transaction:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required : true
    },
    exchange:{
        type: String,
        required : true
    },
    brokerageCharge:{
        type: String,
        required : true
    },
    exchangeCharge:{
        type: String,
        required : true
    },
    gst:{
        type: String,
        required : true
    },
    sebiCharge:{
        type: String,
        required : true
    },
    stampDuty:{
        type: String,
        required : true
    },
    sst:{
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
    uId:{
        type: String,
        required : true
    },
    ctt:{
        type: String,
        required : true
    },
    dpCharge:{
        type: String,
        required : true
    }
})

const brokerageDetail = mongoose.model("trading-brokerage", brokerageSchema);
module.exports = brokerageDetail;