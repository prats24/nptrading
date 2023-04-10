const mongoose = require("mongoose");
const { Schema } = mongoose; 

const PortfolioSchema = new mongoose.Schema({
    portfolioName:{
        type: String,
        required: true
    },
    users:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        linkedOn:{type:Date,default:new Date()},
        protfolioValue:{type:Number}
    }],
    status:{
        type: String,
        required : true
    },
    portfolioValue:{
        type: Number,
        required : true
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
    portfolioAccount:{
        type:String,
        enum:['Free','Paid']
    },
    portfolioType:{
        type:String,
        enum:['Contest','Trading']
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

const userPortfolio = mongoose.model("user-portfolio", PortfolioSchema);
module.exports = userPortfolio;