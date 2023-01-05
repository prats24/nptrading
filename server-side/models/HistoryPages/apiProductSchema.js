const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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

const product = mongoose.model("api-product", productSchema);
module.exports = product;