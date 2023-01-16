const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({

    modifiedOn:{
        type: String,
        required : true
    },
    modifiedBy:{
        type: String,
        required : true
    },
    isAppLive:{
        type: Boolean,
        required: true
    }
})

const settingDetail = mongoose.model("setting-detail", settingSchema);
module.exports = settingDetail;