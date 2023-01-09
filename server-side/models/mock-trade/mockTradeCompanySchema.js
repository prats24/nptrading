const mongoose = require("mongoose");

const mockTradeCompanySchema = new mongoose.Schema({
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
    instrumentToken:{
        type: String, 
        required: true 
    },
    tradeBy:{
        type: String,
        required: true        
    },
    isRealTrade:{ 
        type: Boolean,
        required: true  
    },
    amount:{
        type: Number,
        required: true        
    },
    trade_time:{
        type: String,
        required: true        
    },
    date_part:{
        type: String,
        required : true
    },
    algoBox:{
        algoName:{
            type: String,
            required: true
        },
        transactionChange:{
            type: String,
            required : true
        },
        instrumentChange:{
            type: String,
            required : true
        },
        exchangeChange:{
            type: String,
            required : true
        },
        lotMultipler:{
            type: String,
            required : true
        },
        productChange:{
            type: String,
            required : true
        },
        tradingAccount:{
            type: String,
            required : true
        }
        
    }
})

const mockTradeCompanyDetails = mongoose.model("mock-trade-company", mockTradeCompanySchema);
module.exports = mockTradeCompanyDetails;


