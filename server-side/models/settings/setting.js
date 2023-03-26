const mongoose = require("mongoose");
const Schema = mongoose;
const settingSchema = new mongoose.Schema({

    modifiedOn:{
        type: String,
        required : true
    },
    modifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true,
    },
    isAppLive:{
        type: Boolean,
        required: true
    },
    AppStartTime:{
        type: Date,
        required: true,
    },
    AppEndTime:{
        type: Date,
        required: true,
    }
})

const settingDetail = mongoose.model("setting-detail", settingSchema);
module.exports = settingDetail;