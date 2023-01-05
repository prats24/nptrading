const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    index:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required : true
    },
    ce:{
        type: String,
        required : true
    },
    pe:{
        type: String,
        required : true
    },
    contractDate:{
        type: String,
        required : true
    },
    ceTicker:{
        type: String,
        required : true
    },
    peTicker:{
        type: String,
        required : true
    },
    enableTrade:{
        type: Boolean,
        required : true
    },
    quantity:{
        type: Number,
        required : true
    },
    uId:{
        type: String,
        required : true
    },
    allowedLot:{
        type: String,
        required: true
    },
    amount:{
        type: String,
        required: true
    }
})

const adminDetail = mongoose.model("set-detail", adminSchema);
module.exports = adminDetail;