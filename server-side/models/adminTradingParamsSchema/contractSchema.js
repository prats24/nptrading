const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({

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
    index:{
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
    uId:{
        type: String,
        required : true
    }
})

const contractDetail = mongoose.model("contract-detail", contractSchema);
module.exports = contractDetail;