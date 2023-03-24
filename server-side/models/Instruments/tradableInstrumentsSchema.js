const mongoose = require("mongoose");

const tradableInstrumentSchema = new mongoose.Schema({
    instrument_token:{
        type: Number,
        required: true
    },
    exchange_token:{
        type: Number,
        required : true
    },
    tradingsymbol:{
        type: String,
        required : true
    },
    name:{
        type: String,
        required : true
    },
    last_price:{
        type: Number,
        required : true
    },
    expiry:{
        type: String,
        required : true
    },
    strike:{
        type: Number,
        required : true
    },
    tick_size:{
        type: Number,
        required : true
    },
    lot_size:{
        type: Number,
        required : true
    },
    instrument_type:{
        type: String,
        required : true
    },
    segment:{
        type: String,
        required : true
    },
    exchange:{
        type: String,
        required : true
    },
    lastModifiedBy:{
        type: String,
        required : true,
        default: "System"
    },
    createdBy:{
        type: String,
        required : true,
        default: "System"
    },
    lastModifiedOn:{
        type: String,
        required : true,
        default: Date.now()
    },
    createdOn:{
        type: String,
        required : true,
        default: Date.now()
    },
    status: {
        type: String,
        required : true,
        default: "Active"
    }
})

const tradableInstrumentDetail = mongoose.model("tradable-instrument", tradableInstrumentSchema);
module.exports = tradableInstrumentDetail;
