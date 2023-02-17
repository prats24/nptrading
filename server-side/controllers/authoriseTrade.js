const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const DailyPnlData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema");
const MockTradeData = require("../models/mock-trade/mockTradeUserSchema");
const UserDetail = require("../models/User/userDetailSchema");
const MarginAllocation = require('../models/marginAllocation/marginAllocationSchema');
const axios = require("axios");
const getKiteCred = require('../marketData/getKiteCred'); 
 

exports.fundCheck = async(req, res, next) => {

    const {exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity, userId} = req.body;
    

    console.log("margin req", req.body)

    getKiteCred.getAccess().then(async (data)=>{
    console.log(data)

            let date = new Date();
            let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

            // const api_key = data.getApiKey;
            // const access_token = data.getAccessToken;
            let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
            // let auth = "token nq0gipdzk0yexyko:kDkeVh0s1q71pdlysC0x2a8Koecv4lmZ"
            console.log(auth)
            let headers = {
                'X-Kite-Version':'3',
                'Authorization': auth,
                "content-type" : "application/json"
            }
            let orderData =     [{
                "exchange": exchange,
                "tradingsymbol": symbol,
                "transaction_type": buyOrSell,
                "variety": variety,
                "product": Product,
                "order_type": OrderType,
                "quantity": Quantity,
                "price": 0,
                "trigger_price": 0
            }]

            const user = await UserDetail.findOne({email: userId});
            const userFunds = user.fund;

            let runningLots = await MockTradeData.aggregate([
                {
                $match:
                    {
                        trade_time: {$regex: todayDate},
                        symbol: symbol,
                        userId: userId,
                        status: "COMPLETE",
                    }
                },
                {
                $group:
                    {
                    _id: {symbol: "$symbol"},
                    runningLots: {
                      $sum: {$toInt: "$Quantity"}
                    }
                  }
                },
            ])

            let isSymbolMatch = true;
            let isLesserQuantity = false;
            let isOpposite = false;
            let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
            if(runningLots[0]?._id?.symbol !== symbol){
                isSymbolMatch = false;
            } 
            if(Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)){
                isLesserQuantity = true;
            }
            if(transactionTypeRunningLot !== buyOrSell){
                isOpposite = true;
            }
            console.log(transactionTypeRunningLot, runningLots[0]?._id?.symbol, Math.abs(Number(Quantity)), Math.abs(runningLots[0]?.runningLots))
            let marginData;
            let zerodhaMargin;

            if(runningLots[0]?.runningLots === 0 || (!isSymbolMatch && !isLesserQuantity && !isOpposite)){
                marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
                zerodhaMargin = marginData.data.data.orders[0].total;
            }


            //TODO: get user pnl data and replace 0 with the value 

            let pnlDetails = await MockTradeData.aggregate([
                {
                $match:
                    {
                    userId: userId,
                    status: "COMPLETE",
                    },
                },
                {
                $group:
                    {
                    _id: {
                        email: "$userId",
                        trader: "$createdBy",
                    },
                    gpnl: {
                        $sum: {
                        $multiply: ["$amount", -1],
                        },
                    },
                    brokerage: {
                        $sum: {
                        $toDouble: "$brokerage",
                        },
                    },
                    },
                },
                {
                $addFields:
                    {
                    npnl: {
                        $subtract: ["$gpnl", "$brokerage"],
                    },
                    },
                },
            ])



            let userNetPnl = pnlDetails[0].npnl;
            console.log( userFunds , userNetPnl , zerodhaMargin)
            console.log((userFunds + userNetPnl - zerodhaMargin))
            if((runningLots[0]?.runningLots === 0 || (!isSymbolMatch && !isLesserQuantity && !isOpposite)) && Number(userFunds + userNetPnl - zerodhaMargin)  < 0){
                console.log("in if")
                return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. please try with smaller lot size.'});
            } else{
                next();
            }     
    });
    
   
}

// api create for getting running lots today acc. symbol
// whn usr trd check symbol is matching
// if match 1. if current qnty is lesser from quntity + and opposite trnctio type then return next()
// if 2. crrnt qnty 