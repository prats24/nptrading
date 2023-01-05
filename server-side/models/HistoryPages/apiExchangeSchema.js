const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    active:{
        type: String,
        require: true
    },
    modifiedOn:{
        type: String,
        require: true
    },
    createdOn:{
        type: String,
        require: true
    }
})

const exchange = mongoose.model("api-exchange", exchangeSchema);
module.exports = exchange;