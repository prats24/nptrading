const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    isCategory:{
        type: Boolean,
        required: true
    },
    category:{
        type: String,
        required : true
    },
    sub_category:{
        type: String,
    },
    created_by:{
        type: String,
        required : true
    },
    createdOn:{
        type: String,
        required : true
    },
    lastmodified_by:{
        type: String,
        required : true
    },
    lastmodifiedOn:{
        type: String,
        required : true
    },
    uId:{
        type: String,
        required : true
    },
})

const categoryDetail = mongoose.model("category", categorySchema);
module.exports = categoryDetail;