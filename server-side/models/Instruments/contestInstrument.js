const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestInstrumentSchema = new mongoose.Schema({
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
    isAddedWatchlist: {
        type: Boolean,
        required : true,
        default: true
    },
    createdByUserId:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        // required: true,
    },
    contest:{
        name:String,
        contestId:{type: Schema.Types.ObjectId,ref: 'contest'}
    }

})

const instrumentDetail = mongoose.model("contest-instrument-detail", contestInstrumentSchema);
module.exports = instrumentDetail;