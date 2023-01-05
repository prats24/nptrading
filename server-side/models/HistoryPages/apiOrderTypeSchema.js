const mongoose = require("mongoose");

const orderTypeSchema = new mongoose.Schema({
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

const orderType = mongoose.model("api-orderType", orderTypeSchema);
module.exports = orderType;