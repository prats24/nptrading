const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestRulesSchema = new mongoose.Schema({
    ruleName:{
        type: String,
        required: true
    },
    contestRules:{
        type:[{orderNo:Number,rule:String}],
        required:true,
    },
    status:{
        type:String,
        required: true,
        enum: ['Active','Inactive']
    },
    createdOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
})

const contestRulesData = mongoose.model("contest", contestRulesSchema);
module.exports = contestRulesData;