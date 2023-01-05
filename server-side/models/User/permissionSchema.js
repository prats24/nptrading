const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({

    modifiedOn:{
        type: String,
        required : true
    },
    modifiedBy:{
        type: String,
        required : true
    },
    userName:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    isTradeEnable:{
        type: Boolean,
        required: true
    },
    algoName:{
        type: String,
        required: true
    },
    isRealTradeEnable:{
        type: Boolean,
        required: true
    }
})

const permissionDetail = mongoose.model("user-permission", permissionSchema);
module.exports = permissionDetail;