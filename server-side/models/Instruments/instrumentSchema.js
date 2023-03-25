const mongoose = require("mongoose");

const instrumentSchema = new mongoose.Schema({
    instrument:{
        type: String,
        required: true
    },
    exchange:{
        type: String,
        required : true
    },
    symbol:{
        type: String,
        required : true
    },
    status:{
        type: String,
        required : true
    },
    uId:{
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
    lotSize:{
        type: String,
        required : true
    },
    instrumentToken:{
        type: Number,
        required : true
    },
    contractDate:{
        type: String,
        required : true
    },
    maxLot:{
        type: Number,
        required : true
    },
    otm_p1:{
        type: String,
        // required : true
    },
    otm_p1_Token:{
        type: Number,
        // required : true
    },
    otm_p2:{
        type: String,
        // required : true
    },
    otm_p2_Token:{
        type: Number,
        // required : true
    },
    otm_p3:{
        type: String,
        // required : true
    },
    otm_p3_Token:{
        type: Number,
        // required : true
    },
    user_id: {
        type: String,
        required : true
    },
    isAddedWatchlist: {
        type: Boolean,
        required : true,
        default: true
    }
})

const instrumentDetail = mongoose.model("instrument-detail", instrumentSchema);
module.exports = instrumentDetail;