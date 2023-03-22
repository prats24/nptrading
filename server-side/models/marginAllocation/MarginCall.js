const mongoose = require("mongoose");
const { Schema } = mongoose;

const MarginCallSchema = new mongoose.Schema({
    status:{
        type: String,
        // required: true
    },
    uId:{//random string to be generated
        type: String,
        // required : true
    },
    createdBy:{//req body
        type: String,
        // required : true
    },
    average_price:{//price from req body
        type: Number,
        // required: true
    },
    Quantity:{ //req body
        type: String,
        // required: true
    },
    Product:{//req body
        type: String,
        // required: true
    },
    buyOrSell:{//req body
        type: String,
        // required: true
    },
    order_timestamp:{//
        type: String,
        // required: true
    },
    variety:{//req body
        type: String,
        // required: true
    },
    validity:{//req body
        type: String,
        // required: true
    },
    exchange:{ //req body
        type: String,
        // required: true
    },
    order_type:{//req body
        type: String,
        // required: true
    },
    symbol:{//req body
        type: String,
        // required: true
    },
    userId:{ //req body
        type: String,
        // required: true        
    },
    instrumentToken:{//req.body
        type: String, 
        // required: true 
    },
    tradeBy:{ //same as createdBy from req
        type: String,
        // required: true        
    },
    isRealTrade:{//to be figured
        type: Boolean,
        // required: true  
    },
    amount:{//Quantity * last price
        type: Number,
        // required: true        
    },
    trade_time:{//now
        type: String,
        // required: true        
    },
    createdOn:{
        type: String,
    },
    lastModifiedBy:{
        type: String
    },
    lastModifiedOn:{
        type: String
    },
    marginCallFor:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
});

MarginCallSchema.pre('save', async function(next){
    this.lastModifiedOn = new Date().toISOString().split('T').join(' ').split('.')[0];
    next();
});

const MarginCall = mongoose.model("margin-call", MarginCallSchema);
module.exports = MarginCall;


