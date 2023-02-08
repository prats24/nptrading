//import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const Schema = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required: true
    },
    categoryId:{
        type: String,
        required : true
    },
    status:{
        type: String,
        default: 'Active',
        required : true
    },
    uId:{
        type: String,
        // required : true
    },
    createdOn:{
        type: Date,
        default: Date.now(),
        // required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required : true
    },
    lastModifiedOn:{
        type: Date,
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required : true
    },
    isDeleted:{
        type: Boolean,
        default: false,
        // required : true
    },
    subCategory:[{
        subCategoryName : { 
            type: String,
            //required : false
        },
        uId:{
            type: String,
            // required : true
        },
        createdOn:{
            type: Date,
            default: Date.now(),
            // required : true
        },
        createdBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required : true
        },
        lastModifiedOn:{
            type: Date,
            // required : true
        },
        lastModifiedBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required : true
        },
        isDeleted:{
            type: Boolean,
            default: false,
            // required : true
        },
    }]
})

const category = mongoose.model("category", categorySchema);
module.exports = category;
