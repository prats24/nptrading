const axios = require("axios")
const express = require("express");
const router = express.Router();
const getOrderData = require("./retrieveOrder");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const CompanyTradeData = require("../models/TradeDetails/liveTradeSchema");
const TradeData = require("../models/TradeDetails/allTradeSchema"); 
const UserTradeData = require("../models/TradeDetails/liveTradeUserSchema")
const MockTradeCompany = require("../models/mock-trade/mockTradeCompanySchema")
const MockTradeUser = require("../models/mock-trade/mockTradeUserSchema");
const { response } = require("express");


router.post("/placeorder", (async (req, res)=>{
    let responseMsg;
    let responseErr;
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
        TriggerPrice, validity, variety, createdBy,
         createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, accessToken, userId} = req.body


    const {algoName, transactionChange, instrumentChange
       , exchangeChange, lotMultipler, productChange, tradingAccount} = algoBox

       const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
       const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});

    const api_key = apiKey;
    const access_token = accessToken;
    let auth = 'token ' + api_key + ':' + access_token;

    let headers = {
        'X-Kite-Version':'3',
        'Authorization': auth,
        "content-type" : "application/x-www-form-urlencoded"
    }
    let orderData;


    // variety = "amo";
    // Price = 7;
    // TriggerPrice = 7;
    // realQuantity = 10;
    // OrderType = "LIMIT";
    // Product = "MIS"

    if(variety === "amo"){
        orderData = new URLSearchParams({
            "tradingsymbol":symbol,
            "exchange":exchange,
            "transaction_type":realBuyOrSell,
            "order_type":OrderType,
            "quantity":realQuantity,
            "product":Product,
            "validity":validity,
            "price":Price,
            "trigger_price": TriggerPrice
        })
    } else if(variety === "regular"){
        orderData = new URLSearchParams({
            "tradingsymbol":symbol,
            "exchange":exchange,
            "transaction_type":realBuyOrSell,
            "order_type":OrderType,
            "quantity":realQuantity,
            "product":Product,
            "validity":validity
        })
    }

    axios.post(`https://api.kite.trade/orders/${variety}`, orderData, {headers : headers})
    .then(async (resp)=>{

        const order_Id = resp.data.data.order_id
        console.log("order_id", resp.data.data.order_id);

        const url2 = `https://api.kite.trade/orders/${order_Id}`;
      
        let authOptions = {
          headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
          },
        };


        await retreiveOrderAndSave(url2, authOptions);


    }).catch((err)=>{
        console.log("order id not receive", err)
        res.status(422).json({error : err.response.data.message})
    })

    function retreiveOrderAndSave(url2, authOptions){
        setTimeout(()=>{
            axios.get(url2, authOptions)
            .then(async (response)=>{
                const allOrderData = (response.data).data;
                console.log("allOrderData", allOrderData.length);
                let len = allOrderData.length;
                let orderData;
    
                for(let i = len-1; i >= 0; i--){
                    let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
                        order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
                        pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
                        status_message, status_message_raw} = allOrderData[i]
    
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
    
                    const tradeData = (new TradeData({order_id, status, average_price, quantity, product, transaction_type,
                        order_timestamp, variety, validity, exchange, order_type, price, filled_quantity, 
                        pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,
                        status_message, status_message_raw, exchange_order_id, exchange_timestamp}))
                  
                        //console.log("this is trade data", tradeData, typeof(tradeData));
                        tradeData.save()
                        .then(()=>{
                            //console.log("data enter succesfully")
                        }).catch((err)=> {
                          res.status(500).json({error:"Failed to Enter trade data"});
                          //console.log("failed to enter data of order");
                        })
                }
    
                for(let i = len-1; i >= 0; i--){
                  if(allOrderData[i].status === "COMPLETE" || allOrderData[i].status === "REJECTED" || allOrderData[i].status === "AMO REQ RECEIVED"){
                    orderData = JSON.parse(JSON.stringify(allOrderData[i]));
                  }
                }
    
                if(!orderData){
                    console.log("retreiveOrderAndSave function calling again")
                    await retreiveOrderAndSave(url2, authOptions);
                    return
                }
                //console.log("order data", orderData);
                let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
                       order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
                       pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
                       status_message, status_message_raw} = orderData
             
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
    
                responseMsg = status;
                responseErr = status_message;
    
                if(transaction_type === "SELL"){
                    quantity = -quantity;
                }
                if(buyOrSell === "SELL"){
                    Quantity = -Quantity;
                }
    
                let trade_time = order_timestamp
                let timestamp = order_timestamp.split(" ");
                let timestampArr = timestamp[0].split("-");
                let new_order_timestamp = `${timestampArr[2]}-${timestampArr[1]}-${timestampArr[0]} ${timestamp[1]}`
    
                function buyBrokerage(totalAmount){
                    let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
                    // let totalAmount = Number(Details.last_price) * Number(quantity);
                    let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
                    // console.log("exchangeCharge", exchangeCharge, totalAmount, (Number(brokerageDetailBuy[0].exchangeCharge)));
                    let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
                    let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
                    let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
                    // console.log("stampDuty", stampDuty);
                    let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
                    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
                    return finalCharge;
                }
            
                function sellBrokerage(totalAmount){
                    let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
                    // let totalAmount = Number(Details.last_price) * Number(quantity);
                    let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
                    let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
                    let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
                    let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
                    let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
                    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
            
                    return finalCharge
                }
            
                let brokerageCompany;
                let brokerageUser;
            
                if(transaction_type === "BUY"){
                    brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * average_price);
                } else{
                    brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * average_price);
                }
    
                if(buyOrSell === "BUY"){
                    brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * average_price);
                } else{
                    brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * average_price);
                }
            
    
                CompanyTradeData.findOne({order_id : order_id})
                .then((dateExist)=>{
                    if(dateExist){
                        console.log("data already in real company");
                        return res.status(422).json({error : "data already exist..."})
                    }
                    const tempDate = new Date();
                    let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
                    function addMinutes(date, hours) {
                      date.setMinutes(date.getMinutes() + hours);
                      return date;
                     }
                    const date = new Date(temp_order_save_time);
                    const newDate = addMinutes(date, 330);
                    const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
             
                    const companyTradeData = new CompanyTradeData({
                        disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                        status, uId, createdBy, average_price, Quantity: quantity, 
                        Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
                        variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId,
                        algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
                        lotMultipler, productChange, tradingAccount}, order_id, instrumentToken, brokerage: brokerageCompany,
                        tradeBy: createdBy, isRealTrade: true, amount: (Number(quantity)*average_price), trade_time:trade_time,
                        order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp
    
            
                    });
                    // console.log("this is CompanyTradeData", companyTradeData);
                    // console.log("companyTradeData", companyTradeData)
                    companyTradeData.save().then(()=>{
                    }).catch((err)=> res.status(500).json({error:"Failed to Trade company side"}));
                }).catch(err => {console.log( "fail company live data saving")});
    
                UserTradeData.findOne({order_id : order_id})
                .then((dateExist)=>{
                    if(dateExist){
                        console.log("data already in real user");
                        return res.status(422).json({error : "data already exist..."})
                    }
                    const tempDate = new Date();
                    let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
                    function addMinutes(date, hours) {
                      date.setMinutes(date.getMinutes() + hours);
                      return date;
                     }
                    const date = new Date(temp_order_save_time);
                    const newDate = addMinutes(date, 330);
                    const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
             
                    const userTradeData = new UserTradeData({
                        disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                        status, uId, createdBy, average_price, Quantity: Quantity, 
                        Product:Product, buyOrSell:buyOrSell, order_timestamp: new_order_timestamp,
                        variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by, userId,
                        order_id, instrumentToken, brokerage: brokerageUser,
                        tradeBy: createdBy, isRealTrade: true, amount: (Number(Quantity)*average_price), trade_time:trade_time,
                        order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp
    
    
                    });
                    // console.log("this is userTradeData", userTradeData);
                    userTradeData.save().then(()=>{
                    }).catch((err)=> res.status(500).json({error:"Failed to Trade company side"}));
                }).catch(err => {console.log("fail trader live data saving")});
    
                MockTradeCompany.findOne({uId : uId})
                .then((dateExist)=>{
                    if(dateExist){
                        console.log("data already in mock company");
                        return res.status(422).json({error : "date already exist..."})
                    }
                    const tempDate = new Date();
                    let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
                    function addMinutes(date, hours) {
                      date.setMinutes(date.getMinutes() + hours);
                      return date;
                     }
                    const date = new Date(temp_order_save_time);
                    const newDate = addMinutes(date, 330);
                    const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
             
                    const mockTradeDetails = new MockTradeCompany({
    
                        status, uId, createdBy, average_price, Quantity: quantity, 
                        Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
                        variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId,
                        algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
                        lotMultipler, productChange, tradingAccount}, order_id, instrumentToken, brokerage: brokerageCompany,
                        tradeBy: createdBy, isRealTrade: false, amount: (Number(quantity)*average_price), trade_time:trade_time,
                        order_req_time: createdOn, order_save_time: order_save_time
    
                    });
            
                    // console.log("mockTradeDetails comapny", mockTradeDetails);
                    mockTradeDetails.save().then(()=>{
                        // res.status(201).json({massage : "data enter succesfully"});
                    }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
                }).catch(err => {console.log("fail company mock in placeorder")});
    
                MockTradeUser.findOne({uId : uId})
                .then((dateExist)=>{
                    if(dateExist){
                        console.log("data already in mock user");
                        return res.status(422).json({error : "date already exist..."})
                    }
                    const tempDate = new Date();
                    let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
                    function addMinutes(date, hours) {
                      date.setMinutes(date.getMinutes() + hours);
                      return date;
                     }
                    const date = new Date(temp_order_save_time);
                    const newDate = addMinutes(date, 330);
                    const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
             
                    const mockTradeDetailsUser = new MockTradeUser({
    
                        status, uId, createdBy, average_price, Quantity: Quantity, 
                        Product:Product, buyOrSell:buyOrSell, order_timestamp: new_order_timestamp,
                        variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by, userId,
                        order_id, instrumentToken, brokerage: brokerageUser,
                        tradeBy: createdBy, isRealTrade: false, amount: (Number(Quantity)*average_price), trade_time:trade_time,
                        order_req_time: createdOn, order_save_time: order_save_time
    
                    });
            
                    // console.log("mockTradeDetails", mockTradeDetailsUser);
                    mockTradeDetailsUser.save().then(()=>{
                        // res.status(201).json({massage : "data enter succesfully"});
                    }).catch((err)=> {
                        // res.status(500).json({error:"Failed to enter data"})
                    });
            
                }).catch(err => {console.log("fail company mock in placeorder")});
    
    
                setTimeout(()=>{
                    return res.status(201).json({massage : responseMsg, err: responseErr})
                },0)
    
        
            }).catch((err)=>{
                console.log("err in retreiving data in placeorder", err);
            })
    
        }, 500)
    }

}))






module.exports = router;