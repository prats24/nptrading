const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema({
    date:{
        type: String,
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

const parameterDetail = mongoose.model("parameters-detail", parameterSchema);
module.exports = parameterDetail;