const mongoose = require("mongoose");

const userTradeSchema = new mongoose.Schema({

    order_id:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    uId:{
        type: String,
        required : true
    },
    createdOn:{
        type: String,
        required : true
    },
    createdBy:{
        type: String,
        required : true
    },
    last_price:{
        type: Number,
        required : true
    },
    average_price:{
        type: Number,
        required: true
    },
    Quantity:{
        type: String,
        required: true
    },
    symbol:{
        type: String,
        required: true
    },
    Product:{
        type: String,
        required: true
    },
    buyOrSell:{
        type: String,
        required: true
    },
    validity:{
        type: String,
        required: true
    },
    variety:{
        type: String,
        required: true
    },
    order_timestamp:{
        type: String,
        required: true
    },
    order_type:{
        type: String,
        required: true
    },
    amount:{
        type: String,
    },
    exchange:{
        type: String,
        required: true
    },
    traderName:{
        type: String,
    },
    traderId:{
        type: String,
    },
    userId:{
        type: String,
        required: true        
    },
    brokerageCharge:{
        type: String,     
    },
    realAmount:{
        type: String,
        required: true        
    },
    tradeBy: {
        type: String
    }
})

const userTradeDetail = mongoose.model("user-trade-detail", userTradeSchema);
module.exports = userTradeDetail;