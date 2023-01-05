const mongoose = require("mongoose");

const validitySchema = new mongoose.Schema({
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

const validity = mongoose.model("api-validity", validitySchema);
module.exports = validity;