const express = require("express");
const router = express.Router();
require("../../db/conn");
const InstrumentDetail = require("../../models/Instruments/instrumentSchema");
const EveryMinuteData = require("../../models/InstrumentHistoricalData/InstrumentHistoricalData");
const MockTradeCompanyDetails = require("../../models/mock-trade/mockTradeCompanySchema");


router.get("/history", async (req, res)=>{
    const date = new Date();// , order_timestamp: {$regex: "06-01-2023"}
    let startTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    // while(startTime < "15:30"){
        let trade = await MockTradeCompanyDetails.aggregate([
            { $match: { order_timestamp : {$gte :{$regex: "06-01-2023 09:25"}, $lte: {$regex: "06-01-2023 09:27"} }}},
            
            { $group: { _id: {
                                    // "traderId": "$userId",
                                    // "buyOrSell": "$buyOrSell",
                                    // "traderName": "$createdBy",
                                    "symbol": "$symbol"
                                },
                        amount: {
                            $sum: "$amount"
                        },
                        brokerage: {
                            $sum: {$toDouble : "$brokerage"}
                        },
                        lots: {
                            $sum: {$toInt : "$Quantity"}
                        },
                        // trades: {
                        //     $count: {}
                        // }
                        }},
                { $sort: {_id: -1}},
            
                ])

                res.status(201).json(trade);
    // }
    
    // const {ExchangeNameIncoming, IncomingExchangeCode, ExchangeNameOutgoing, OutgoingInstrumentCode, Status, lastModified, uId, createdBy, createdOn} = req.body;

    // if(!ExchangeNameIncoming || !IncomingExchangeCode || !ExchangeNameOutgoing || !OutgoingInstrumentCode || !Status || !lastModified || !uId || !createdBy || !createdOn){
    //     console.log(req.body);
    //     console.log("data nhi h pura");
    //     return res.status(422).json({error : "plz filled the field..."})
    // }

    // ExchangeMapping.findOne({uId : uId})
    // .then((dateExist)=>{
    //     if(dateExist){
    //         console.log("data already");
    //         return res.status(422).json({error : "date already exist..."})
    //     }
    //     const exchangeMapping = new ExchangeMapping({ExchangeNameIncoming, IncomingExchangeCode, ExchangeNameOutgoing, OutgoingInstrumentCode, Status, lastModified, uId, createdBy, createdOn});
    //     console.log("this is exchange mapping", typeof(exchangeMapping) , exchangeMapping);
    //     exchangeMapping.save().then(()=>{
    //         res.status(201).json({massage : "data enter succesfully"});
    //     }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    // }).catch(err => {console.log(err, "fail")});
})

module.exports = router;

