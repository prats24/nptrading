const mongoose = require("mongoose");

const addInstrumentSchema = new mongoose.Schema({
    instrument_token:{
        type: Number,
        required: true
    },
    tradingsymbol:{
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
        required : true
    },
    otm_p1_Token:{
        type: Number,
        required : true
    },
    otm_p2:{
        type: String,
        required : true
    },
    otm_p2_Token:{
        type: Number,
        required : true
    },
    otm_p3:{
        type: String,
        required : true
    },
    otm_p3_Token:{
        type: Number,
        required : true
    }
})

const instrumentDetail = mongoose.model("watchlist-detail", addInstrumentSchema);
module.exports = instrumentDetail;