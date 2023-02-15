const mongoose = require("mongoose");

const mockTradeSchema = new mongoose.Schema({
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
    createdBy:{
        type: String,
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
    Product:{
        type: String,
        required: true
    },
    buyOrSell:{
        type: String,
        required: true
    },
    order_timestamp:{
        type: String,
        required: true
    },
    variety:{
        type: String,
        required: true
    },
    validity:{
        type: String,
        required: true
    },
    exchange:{
        type: String,
        required: true
    },
    order_type:{
        type: String,
        required: true
    },
    symbol:{
        type: String,
        required: true
    },
    placed_by:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true        
    },
    brokerage:{
        type: String,        
    },
    isRealTrade:{ 
        type: Boolean,
        required: true  
    },
    instrumentToken:{
        type: String,
        required: true        
    },
    tradeBy:{
        type: String,
        required: true        
    },
    amount:{
        type: Number,
        required: true        
    },
    trade_time:{
        type: String,
        // required: true        
    },
    otm:{
        type: String,
    },
    otm_quantity:{
        type: String,
    },
    otm_token:{
        type: String,
    },
    isMissed:{
        type: Boolean,
        default: false
    },
})

const MockTradeDetails = mongoose.model("mock-trade-user", mockTradeSchema);
module.exports = MockTradeDetails;


