const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema({
    createdOn:{
        type: String,
        required: true
    },
    variety:{
        type: String,
        required : true
    },
    exchange:{
        type: String,
        required : true
    },
    orderType:{
        type: String,
        required : true
    },
    validity:{
        type: String,
        required : true
    },
    status:{
        type: String,
        required : true
    },
    lastModified:{
        type: String,
        required : true
    },
    createdBy:{
        type: String,
        required: true
    }
})

const parameterDetail = mongoose.model("trading-parameter", parameterSchema);
module.exports = parameterDetail;