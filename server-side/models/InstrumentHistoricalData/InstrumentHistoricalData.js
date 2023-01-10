const mongoose = require("mongoose");

const instrumentHistoricalDataSchema = new mongoose.Schema({
    timestamp:{
        type: String,
        required: true
    },
    symbol:{
        type: String,
        required: true
    },
    instrumenttoken:{
        type: String,
        required: true
    },
    open:{
        type: Number,
        required : true
    },
    high:{
        type: Number,
        required : true
    },
    low:{
        type: Number,
        required : true
    },
    close:{
        type: Number,
        required : true
    },
    volume:{
        type: Number,
        required : true
    },
    createdOn:{
        type: String,
        required : true
    }
})

const instrumentHistoricalData = mongoose.model("instrument-ticks-history", instrumentHistoricalDataSchema);
module.exports = instrumentHistoricalData;