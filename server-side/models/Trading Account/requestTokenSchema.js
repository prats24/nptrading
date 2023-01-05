const mongoose = require("mongoose");

const requestTokenSchema = new mongoose.Schema({
    accountId:{
        type: String,
        required: true
    },
    accessToken:{
        type: String,
        required : true
    },
    requestToken:{
        type: String,
        required : true
    },
    status:{
        type: String,
        required : true
    },
    generatedOn:{
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
    },
    uId:{
        type: String,
        required: true
    }
})

const requestTokenDetail = mongoose.model("trading-request-token", requestTokenSchema);
module.exports = requestTokenDetail;