const mongoose = require("mongoose");

const verietySchema = new mongoose.Schema({
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

const veriety = mongoose.model("api-veriety", verietySchema);
module.exports = veriety;