const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    uId:{
        type: String,
        required: true
    },
    instrument:{
        type: String,
        required: true
    },
    veriety:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    orderType:{
        type: String,
        required: true
    },
    validity:{
        type: String,
        required: true
    },
    quantity:{
        type: String,
        required: true
    },
    dayOrOvernight:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    createdOn:{
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },
    lastModified:{
        type: String,
        required: true
    }
})

const tradeDetail = mongoose.model("trade-detail", tradeSchema);
module.exports = tradeDetail;