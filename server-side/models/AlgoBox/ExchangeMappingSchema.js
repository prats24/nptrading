const mongoose = require("mongoose");

const exchangeMappingSchema = new mongoose.Schema({
    ExchangeNameIncoming:{
        type: String,
        required: true
    },
    IncomingExchangeCode:{
        type: String,
        required : true
    },
    ExchangeNameOutgoing:{
        type: String,
        required : true
    },
    Status:{
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
    OutgoingInstrumentCode:{
        type: String,
        required : true
    }
})

const exchangeMappingDetail = mongoose.model("algo-exchange", exchangeMappingSchema);
module.exports = exchangeMappingDetail;