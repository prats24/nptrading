const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const DailyPnlData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema");
const MockTradeData = require("../models/mock-trade/mockTradeUserSchema");
const UserDetail = require("../models/User/userDetailSchema");
const MarginAllocation = require('../models/marginAllocation/marginAllocationSchema');
const axios = require("axios");
const getKiteCred = require('../marketData/getKiteCred'); 
const MarginCall = require('../models/marginAllocation/MarginCall');
const { v4: uuidv4 } = require('uuid');
 

exports.fundCheck = async(req, res, next) => {

    const {exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity, userId} = req.body;
    

    ////console.log("margin req", req.body)

    getKiteCred.getAccess().then(async (data)=>{
    // //console.log(data)

            let date = new Date();
            let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

            // const api_key = data.getApiKey;
            // const access_token = data.getAccessToken;
            let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
            // let auth = "token nq0gipdzk0yexyko:kDkeVh0s1q71pdlysC0x2a8Koecv4lmZ"
            //console.log(auth)
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
            let userFunds;
            try{
                const user = await UserDetail.findOne({email: userId});
                userFunds = user.fund;
            }catch(e){
                console.log("errro fetching user", e);
            }

            let runningLots;
            try{

                runningLots = await MockTradeData.aggregate([
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
            } catch(e){
                console.log("errro fetching pnl", e);

            }

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
            if(((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
                //console.log("checking runninglot- reverse trade");
                return next();
            }
            //console.log(transactionTypeRunningLot, runningLots[0]?._id?.symbol, Math.abs(Number(Quantity)), Math.abs(runningLots[0]?.runningLots))
            let marginData;
            let zerodhaMargin;

            // if( (!runningLots[0]?.runningLots) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            try{
                //console.log("fetching margin data")
                marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
                
                zerodhaMargin = marginData.data.data.orders[0].total;
                //console.log("zerodhaMargin", zerodhaMargin);
            }catch(e){
                // console.log("error fetching zerodha margin", e);
            } 
            // }


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



            let userNetPnl = pnlDetails[0]?.npnl;
            console.log( userFunds , userNetPnl , zerodhaMargin)
            console.log((userFunds + userNetPnl - zerodhaMargin))
            // if(( !runningLots[0]?.runningLots || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) && Number(userFunds + userNetPnl - zerodhaMargin)  < 0){
            // if(( !runningLots[0]?.runningLots || (((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot == buyOrSell))) && Number(userFunds + userNetPnl - zerodhaMargin)  < 0){   
                // //console.log("in if")
                // return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
            if(Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
                //console.log("user wants square off")
                return next();
            } else{
                if(Number(userFunds + userNetPnl - zerodhaMargin)  < 0){
                    let uid = uuidv4();
                    let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                        TriggerPrice, validity, variety, createdBy,
                            createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, 
                            accessToken, userId, checkingMultipleAlgoFlag, real_instrument_token, realSymbol, trader} = req.body;

                    let dateNow = new Date().toISOString().split('T').join(' ').split('.')[0];    
                    
                    try{
                        const marginCall = new MarginCall({status: 'MARGIN CALL', uId: uid, createdBy: createdBy, average_price: zerodhaMargin/Quantity, Quantity: Quantity, Product:Product,
                            buyOrSell: buyOrSell, order_timestamp: dateNow, validity: validity, exchange: exchange, order_type: OrderType, variety: variety,
                        symbol: symbol, instrumentToken: instrumentToken, tradeBy: createdBy, marginCallFor: trader, amount: Number(Quantity)*Number(Price), trade_time: dateNow, lastModifiedBy: userId});
    
                        console.log("margincall saving")
                        await marginCall.save();
                    }catch(e){
                        console.log("error saving margin call", e);
                    }

                    //console.log("sending response from authorise trade");
                    return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
                }
                else{
                    //console.log("if user have enough funds")
                    return next();
                }
            }     
    });
    
   
}


