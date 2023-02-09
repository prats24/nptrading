const mongoose = require("mongoose");

const instrumentMappingSchema = new mongoose.Schema({
    InstrumentNameIncoming:{
        type: String,
        required: true
    },
    incomingInstrumentExchange:{
        type: String,
        // required: true
    },
    outgoingInstrumentExchange:{
        type: String,
        // required: true
    },
    IncomingInstrumentCode:{
        type: String,
        required : true
    },
    InstrumentNameOutgoing:{
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
    lastModifiedBy:{
        type: String,
        // required : true
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

const instrumentMappingDetail = mongoose.model("algo-instrument", instrumentMappingSchema);
module.exports = instrumentMappingDetail;