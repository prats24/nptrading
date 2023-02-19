const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserTradeData = require("../../models/TradeDetails/liveTradeUserSchema");
const MockTradeDetailsUser = require("../../models/mock-trade/mockTradeUserSchema");
const CompanyTradeData = require("../../models/TradeDetails/liveTradeSchema");
const MockTradeDetails = require("../../models/mock-trade/mockTradeCompanySchema");
const RetreiveOrderTrade = require("../../models/TradeDetails/retreiveOrder")
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const fetchToken = require("../../marketData/generateSingleToken")

router.post("/enterDataInDB", async (req, res)=>{
    const {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
        productChange, tradingAccount, _id, marginDeduction, isDefault, 
        instrument, enterDate, userId, createdBy, uId} = req.body;

        let instrumentToken = await fetchToken("NFO", instrument)
        // let instrumentToken = "11289858";
        console.log(req.body, instrumentToken)
    const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
    const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


    if(!algoName || !transactionChange || !instrumentChange || !exchangeChange || !lotMultipler || !productChange || !tradingAccount || !_id || !instrument || !enterDate){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "Did not receive all feild in backend"})
    }

    const missedOrderId = await RetreiveOrderTrade.aggregate([
        {
          $match: {
            order_timestamp: { $regex: enterDate },
            status: "COMPLETE",
            tradingsymbol: instrument


          }
        },
        {
          $lookup: {
            from: "live-trade-companies",
            localField: "order_id",
            foreignField: "order_id",
            as: "completed_trade"
          }
        },
        {
          $match: {
            completed_trade: {
              $size: 0
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            order_id: {$first: "$order_id"},
            status: {$first: "$status"},    
            average_price: {$first: "$average_price"},
            quantity: {$first: "$quantity"} ,
            product: {$first: "$product"},
            transaction_type: {$first: "$transaction_type"},
            exchange_order_id: {$first: "$exchange_order_id"},
            order_timestamp: {$first: "$order_timestamp"},
            variety: {$first: "$variety"},
            validity: {$first: "$validity"},
            exchange: {$first: "$exchange"},
            exchange_timestamp: {$first: "$exchange_timestamp"},
            order_type: {$first: "$order_type"},
            price: {$first: "$price"},
            filled_quantity: {$first: "$filled_quantity"},
            pending_quantity: {$first: "$pending_quantity"},
            cancelled_quantity: {$first: "$cancelled_quantity"},
            guid: {$first: "$guid"},
            market_protection: {$first: "$market_protection"},
            disclosed_quantity: {$first: "$disclosed_quantity"},
            tradingsymbol: {$first: "$tradingsymbol"},
            placed_by: {$first: "$placed_by"},
            status_message: {$first: "$status_message"},
            status_message_raw: {$first: "$status_message_raw"},

          }
        }
    ]);

    for(let i = 0; i < missedOrderId.length; i++){
        let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
            order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
            pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
            status_message, status_message_raw} = missedOrderId[i]
  
        if(!status_message){
            status_message = "null"
        }
        if(!status_message_raw){
            status_message_raw = "null"
        }
        if(!exchange_timestamp){
            exchange_timestamp = "null"
        }
        if(!exchange_order_id){
            exchange_order_id = "null"
        }

        let userBuyOrSell;
        let userQuantity = quantity;
        console.log("instrumentToken", instrumentToken)
        if(transactionChange === "TRUE"){
            if(transaction_type === "SELL"){
                userBuyOrSell = "BUY";
                quantity = -quantity;
            } else{
                userBuyOrSell = "SELL";
                userQuantity = -userQuantity
            }
        }

        userQuantity = userQuantity*lotMultipler;

        let trade_time = order_timestamp
        let timestamp = order_timestamp.split(" ");
        let timestampArr = timestamp[0].split("-");
        let new_order_timestamp = `${timestampArr[2]}-${timestampArr[1]}-${timestampArr[0]} ${timestamp[1]}`


        function buyBrokerage(totalAmount){
            let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
            let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
            let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
            let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
            let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
            let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
            let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
            return finalCharge;
        }
    
        function sellBrokerage(totalAmount){
            let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
            let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
            let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
            let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
            let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
            let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
            let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    
            return finalCharge
        }
    
        let brokerageUser;
        let brokerageCompany;
    
        if(transaction_type === "BUY"){
            brokerageCompany = buyBrokerage(Math.abs(Number(quantity)) * average_price);
        } else{
            brokerageCompany = sellBrokerage(Math.abs(Number(quantity)) * average_price);
        }
    
        if(userBuyOrSell === "BUY"){
            brokerageUser = buyBrokerage(Math.abs(Number(userQuantity)) * average_price);
        } else{
            brokerageUser = sellBrokerage(Math.abs(Number(userQuantity)) * average_price);
        }
     
    
    
        CompanyTradeData.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "data already exist..."})
            }
        
            const companyTradeData = new CompanyTradeData({
                disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                status, uId, createdBy, average_price, Quantity: quantity, 
                Product: product, buyOrSell: transaction_type, order_timestamp: new_order_timestamp,
                variety, validity, exchange, order_type, symbol: tradingsymbol, placed_by, userId,
                algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken, brokerage: brokerageCompany,
                tradeBy: createdBy, isRealTrade: true, amount: (Number(quantity)*average_price), trade_time,
                order_req_time: order_timestamp, order_save_time: order_timestamp, exchange_order_id

            });
            // //console.log("this is CompanyTradeData", companyTradeData);
            //console.log("companyTradeData", companyTradeData)
            companyTradeData.save().then(()=>{
                if(missedOrderId.length-1 === i){
                    res.status(200).json({message: "DB Entry success"})
                }
                
            }).catch((err)=> console.log(err, "fail"));
        }).catch(err => {console.log(err, "fail")});

        UserTradeData.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "data already exist..."})
            }
        
            const userTradeData = new UserTradeData({
                disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, 
                market_protection, guid,
                status, uId, createdBy, average_price, Quantity: userQuantity, 
                Product: product, buyOrSell: userBuyOrSell, order_timestamp: new_order_timestamp,
                variety, validity, exchange, order_type, symbol: tradingsymbol, placed_by, userId,
                order_id, instrumentToken, brokerage: brokerageUser,
                tradeBy: createdBy, isRealTrade: true, amount: (Number(userQuantity)*average_price), trade_time,
                order_req_time: order_timestamp, order_save_time: order_timestamp,
                exchange_order_id


            });
            // //console.log("this is userTradeData", userTradeData);
            userTradeData.save().then(()=>{
            }).catch((err)=> console.log(err, "fail"));
        }).catch(err => {console.log(err, "fail")});

        MockTradeDetails.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }

            const mockTradeDetails = new MockTradeDetails({
                status, uId, createdBy, average_price, Quantity: quantity, 
                Product: product, buyOrSell: transaction_type, order_timestamp: new_order_timestamp,
                variety, validity, exchange, order_type, symbol: tradingsymbol, placed_by, userId,
                algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken, brokerage: brokerageCompany,
                tradeBy: createdBy, isRealTrade: true, amount: (Number(quantity)*average_price), trade_time,
                exchange_order_id
                
            });

            console.log("mockTradeDetails comapny", mockTradeDetails);
            mockTradeDetails.save().then(()=>{
                // res.status(201).json({massage : "data enter succesfully"});
            }).catch((err)=> console.log(err, "fail"))
            
        }).catch(err => {console.log(err, "fail")});

        MockTradeDetailsUser.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }

            const mockTradeDetailsUser = new MockTradeDetailsUser({

                status, uId, createdBy, average_price, Quantity: userQuantity, 
                Product: product, buyOrSell: userBuyOrSell, order_timestamp: new_order_timestamp,
                variety, validity, exchange, order_type, symbol: tradingsymbol, placed_by, userId,
                order_id, instrumentToken, brokerage: brokerageUser,
                tradeBy: createdBy, isRealTrade: false, amount: (Number(userQuantity)*average_price), trade_time,
                exchange_order_id
                
            });

            console.log("mockTradeDetails", mockTradeDetailsUser);
            mockTradeDetailsUser.save().then(()=>{
                // res.status(201).json({massage : "data enter succesfully"});
            }).catch((err)=> {
                console.log(err, "fail")
            });
            

        }).catch(err => {console.log(err, "fail")});
    
    


    }


    
})



module.exports = router;