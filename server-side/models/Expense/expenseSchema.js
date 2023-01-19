const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    expense_date:{
        type: String,
        required: true
    },
    sub_category:{
        type: String,
        required : true
    },
    category:{
        type: String,
        required : true
    },
    amount:{
        type: Number,
        required : true
    },
    gst:{
        type: Number,
        required : true
    },
    total_amount:{
        type: Number,
        required : true
    },
    description:{
        type: String,
        required : true
    },
    payment_status:{
        type: String,
        required : true
    },
    expense_by:{
        type: Number,
        required : true
    },
    created_by:{
        type: Number,
        required : true
    },
    invoice_upload:{
        data: Buffer,
        contentType: String
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

const expenseDetail = mongoose.model("expense", expenseSchema);
module.exports = expenseDetail;