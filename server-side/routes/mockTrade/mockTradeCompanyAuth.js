const express = require("express");
const router = express.Router();
const transactioncostcalculation = require("../transactioncostcalculation");
const instrumenttickshistorydatafunction = require("../../marketData/getinstrumenttickshistorydata");
require("../../db/conn");
const MockTradeDetails = require("../../models/mock-trade/mockTradeCompanySchema");
const MockTradeDetailsUser = require("../../models/mock-trade/mockTradeUserSchema");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const HistoryData = require("../../models/InstrumentHistoricalData/InstrumentHistoricalData");
const PNLData = require("../../models/InstrumentHistoricalData/DailyPnlDataSchema");
const TraderPNLData = require("../../models/InstrumentHistoricalData/TraderDailyPnlDataSchema");
const LiveTradeDetails = require("../../models/TradeDetails/liveTradeSchema");
const OtmMock = require("../../models/mock-trade/otmMockSchema");
const axios = require('axios');
const getKiteCred = require('../../marketData/getKiteCred');

const CompanyTradeData = require("../../models/TradeDetails/liveTradeSchema");
const UserTradeData = require("../../models/TradeDetails/liveTradeUserSchema"); 
const dailyPnlDataController = require("../../controllers/dailyPnlDataController")
const traderwiseDailyPnlController = require("../../controllers/traderwiseDailyPnlController")



// router.get("/deleteTodaysMockData", async(req, res)=>{
//     let cursor = await CompanyTradeData.aggregate([
//         { $match: { trade_time: { $regex: "2023-02-13" } } }
//       ])
      
//       let i = 0;
//       cursor.forEach(async (doc, index)=>{
//           // doc.dups[0].shift()
//            console.log(doc, i++)
//           await CompanyTradeData.deleteMany({_id:{$in:doc}})
//           console.log("deleted")
//       })
// })

// router.get("/upadteinstrumenttickshistorydata", async(req, res)=>{
//     // if(dailyPnl.length === 0){
//         console.log("dailyPnlCalculation running")
//         await dailyPnlDataController.dailyPnlCalculation("2023-02-02");
//     //   }

//     //   if(traderDailyPnl.length === 0){
//         console.log("traderDailyPnlCalculation running")
//         await traderwiseDailyPnlController.traderDailyPnlCalculation("2023-02-02");
//     //   }
// })

// router.get("/deleteinhistory", async(req, res)=>{
//     TraderPNLData.deleteMany({timestamp: {$regex: "2023-02-02"}})
//     .then(()=>{
//         console.log("deleted")
//     }).catch(()=>{
//         //console.log("err")
//     })
    
// })




router.post("/livetradecompanytemp", async (req, res)=>{

let {exchange, symbol, buyOrSell, Quantity, Price, Product, order_type, TriggerPrice, stopLoss, validity, variety, last_price, createdBy, userId, 
    createdOn, uId, placed_by, order_id, status, average_price, order_timestamp, 
    brokerage, instrumentToken, tradeBy, isRealTrade, amount, trade_time, algoBox, disclosed_quantity, 
    price, guid, market_protection, cancelled_quantity, pending_quantity, 
    filled_quantity, exchange_order_id } = req.body 

    const {algoName, transactionChange, instrumentChange
        , exchangeChange, lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault} = algoBox


        const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
        const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


        let realQuantity = Quantity;
        let realBuyOrSell = buyOrSell;
        // let realAmount = amount;

        if(realBuyOrSell === "SELL"){
            realQuantity = "-"+realQuantity;
            // realAmount = "-"+realAmount;
            
        }

    if(buyOrSell === "SELL"){
        buyOrSell = "BUY" 
    } else{
        buyOrSell = "SELL"
    }


    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
        // amount = "-"+amount; 
    }


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

    if(realBuyOrSell === "BUY"){
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
                        //console.log("data already");
                        return res.status(422).json({error : "data already exist..."})
                    }
             
                    const companyTradeData = new CompanyTradeData({
                        disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                        status, uId, createdBy, average_price, Quantity: realQuantity, 
                        Product, buyOrSell: realBuyOrSell, order_timestamp,
                        variety, validity, exchange, order_type, symbol, placed_by, userId,
                        algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
                        lotMultipler, productChange, tradingAccount, _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true}, order_id, instrumentToken, brokerage: brokerageCompany,
                        tradeBy, isRealTrade: true, amount: (Number(realQuantity)*average_price), trade_time,
                        order_req_time: order_timestamp, order_save_time: order_timestamp, exchange_order_id
    
            
                    });
                    // //console.log("this is CompanyTradeData", companyTradeData);
                    //console.log("companyTradeData", companyTradeData)
                    companyTradeData.save().then(()=>{
                        res.status(200).json("success")
                    }).catch((err)=> res.status(500).json({error:"Failed to Trade company side"}));
                }).catch(err => {console.log(err, "fail")});
    
                UserTradeData.findOne({order_id : order_id})
                .then((dateExist)=>{
                    if(dateExist){
                        //console.log("data already");
                        return res.status(422).json({error : "data already exist..."})
                    }
             
                    const userTradeData = new UserTradeData({
                        disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                        status, uId, createdBy, average_price, Quantity, 
                        Product, buyOrSell, order_timestamp,
                        variety, validity, exchange, order_type, symbol, placed_by, userId,
                        order_id, instrumentToken, brokerage: brokerageUser,
                        tradeBy, isRealTrade: true, amount: (Number(Quantity)*average_price), trade_time,
                        order_req_time: order_timestamp, order_save_time: order_timestamp,
                        exchange_order_id
    
    
                    });
                    // //console.log("this is userTradeData", userTradeData);
                    userTradeData.save().then(()=>{
                    }).catch((err)=> res.status(500).json({error:"Failed to Trade company side"}));
                }).catch(err => {console.log(err, "fail")});

                MockTradeDetails.findOne({order_id : order_id})
                .then((dateExist)=>{
                    if(dateExist){
                        //console.log("data already");
                        return res.status(422).json({error : "date already exist..."})
                    }
            
                    const mockTradeDetails = new MockTradeDetails({
                        status:"COMPLETE", uId, createdBy, average_price: average_price, Quantity: realQuantity, 
                        Product, buyOrSell:realBuyOrSell, order_timestamp,
                        variety, validity, exchange, order_type, symbol, placed_by: "ninepointer", userId,
                            algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
                        lotMultipler, productChange, tradingAccount, _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true}, order_id, instrumentToken, brokerage: brokerageCompany,
                        tradeBy, isRealTrade: false, amount: (Number(realQuantity)*average_price), trade_time,
                        exchange_order_id
                        
                    });
            
                    console.log("mockTradeDetails comapny", mockTradeDetails);
                    mockTradeDetails.save().then(()=>{
                        // res.status(201).json({massage : "data enter succesfully"});
                    }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
                    
                }).catch(err => {console.log(err, "fail")});
            
                MockTradeDetailsUser.findOne({order_id : order_id})
                .then((dateExist)=>{
                    if(dateExist){
                        //console.log("data already");
                        return res.status(422).json({error : "date already exist..."})
                    }
            
                    const mockTradeDetailsUser = new MockTradeDetailsUser({
                        status:"COMPLETE", uId, createdBy, average_price, Quantity, Product, buyOrSell, order_timestamp,
                        variety, validity, exchange, order_type, symbol, placed_by: "ninepointer", userId,
                        isRealTrade: false, order_id, instrumentToken, brokerage: brokerageCompany, 
                        tradeBy, amount: (Number(Quantity)*average_price), trade_time, exchange_order_id
                        
                    });
            
                    console.log("mockTradeDetails", mockTradeDetailsUser);
                    mockTradeDetailsUser.save().then(()=>{
                        // res.status(201).json({massage : "data enter succesfully"});
                    }).catch((err)=> {
                        // res.status(500).json({error:"Failed to enter data"})
                    });
                    
            
                }).catch(err => {console.log(err, "fail")});


    

})





router.post("/mocktradecompany", async (req, res)=>{

    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType,
          validity, variety, createdBy, userId, uId, algoBox, order_id, instrumentToken,  
          realBuyOrSell, realQuantity, checkingMultipleAlgoFlag, real_instrument_token, realSymbol } = req.body 

        // console.log("this is mock trade comny req", req.body);

    const {algoName, transactionChange, instrumentChange
        , exchangeChange, lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault} = algoBox

        const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
        const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety || !algoName || !transactionChange || !instrumentChange || !exchangeChange || !lotMultipler || !productChange || !tradingAccount){
        //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
        //console.log("data is not complete");
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        realQuantity = "-"+realQuantity;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let originalLastPriceUser;
    let originalLastPriceCompany;
    let newTimeStamp = "";
    let trade_time = "";
    try{
        
        let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
        //console.log(liveData)
        for(let elem of liveData.data){
            //console.log(elem)
            if(elem.instrument_token == instrumentToken){
                newTimeStamp = elem.timestamp;
                originalLastPriceUser = elem.last_price;
            }
            if(elem.instrument_token == real_instrument_token){
                originalLastPriceCompany = elem.last_price;
            }
        }

        trade_time = newTimeStamp;
        let firstDateSplit = (newTimeStamp).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        newTimeStamp = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]} ${firstDateSplit[1]}`


    } catch(err){
        return new Error(err);
    }



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

    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    }
 

    MockTradeDetails.findOne({order_id : order_id})
    .then((dateExist)=>{
        if(dateExist && dateExist.order_timestamp !== newTimeStamp && checkingMultipleAlgoFlag === 1){
            console.log("data already in mock company", checkingMultipleAlgoFlag);
            return res.status(422).json({error : "date already exist..."})
        }

        const mockTradeDetails = new MockTradeDetails({
            status:"COMPLETE", uId, createdBy, average_price: originalLastPriceCompany, Quantity: realQuantity, 
            Product, buyOrSell:realBuyOrSell, order_timestamp: newTimeStamp,
            variety, validity, exchange, order_type: OrderType, symbol: realSymbol, placed_by: "ninepointer", userId,
                algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
            lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken: real_instrument_token, brokerage: brokerageCompany,
            tradeBy: createdBy, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), trade_time:trade_time,
            
        });

        // console.log("mockTradeDetails comapny", mockTradeDetails);
        mockTradeDetails.save().then(()=>{
            
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        
    }).catch(err => {console.log(err, "fail")});

    if(checkingMultipleAlgoFlag === 1){
        MockTradeDetailsUser.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }

            const mockTradeDetailsUser = new MockTradeDetailsUser({
                status:"COMPLETE", uId, createdBy, average_price: originalLastPriceUser, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "ninepointer", userId,
                isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, 
                tradeBy: createdBy, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });

            //console.log("mockTradeDetails", mockTradeDetailsUser);
            mockTradeDetailsUser.save().then(()=>{
                res.status(201).json({massage : "data enter succesfully"});
            }).catch((err)=> {
                // res.status(500).json({error:"Failed to enter data"})
            });
            

        }).catch(err => {console.log("fail")});
    }
    

})

router.get("/readmocktradecompany", (req, res)=>{
    MockTradeDetails.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
         
            return res.status(200).send(data);
        }
    })
})

router.get("/readmocktradecompanycount", (req, res)=>{
    MockTradeDetails.count((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readmocktradecompanycountToday", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

    MockTradeDetails.count({order_timestamp: {$regex: todayDate}},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readmocktradecompanyYesterday", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    //console.log(date);
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log(todayDate);

    let daytosubs = 1;
    //console.log("Days to Subs"+daytosubs);
    
    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - daytosubs);
    //console.log(String(yesterday).slice(0,10));
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    //console.log(yesterdayDate);

    MockTradeDetails.count({trade_time: {$regex: yesterdayDate}},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })

})

router.get("/readmocktradecompany/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    MockTradeDetails.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanyemail/:email", (req, res)=>{
    const {email} = req.params
    MockTradeDetails.find({userId: email}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})


router.get("/readmocktradecompanyDate", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    //console.log(todayDate)
    MockTradeDetails.find({order_timestamp: {$regex: "06-01-2023"}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanypariculardate/:date", (req, res)=>{
    const {date} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: date}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanypagination/:skip/:limit", (req, res)=>{
    //console.log(req.params)
    const {limit, skip} = req.params
    MockTradeDetails.find().sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanytodaydatapagination/:skip/:limit", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {limit, skip} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}}).sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanypariculardatewithemail/:date/:email", (req, res)=>{
    const {date, email} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: date}, userId: email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanyDate/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate);
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time:-1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanyThisMonth", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    let monthStart = `${String(01).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate)
    // MockTradeDetails.find({order_timestamp: {$regex: todayDate}})
    MockTradeDetails.find({trade_time: {$gte:monthStart,$lt: todayDate}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanyLastMonth", async(req, res)=>{
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    //console.log("Indian Date, UTC Date, Month & Year",indiaDate,date,month, year);
    if(month == 0)
    {
        month = '12'
        year = year-1
    }
    else
    {
        month = month
        year = year
    }

    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    let nodaysinmonth =  daysInMonth(month, year);
   // console.log("No of days in previous month : "+nodaysinmonth)

    let todayDate = `${(date.getFullYear()-1 == date.getFullYear() ? date.getFullYear() : date.getFullYear()-1)}-${String(date.getFullYear()-1 == date.getFullYear() ? date.getMonth() : '12').padStart(2, '0')}-${String('01').padStart(2, '0')}`
    const {email} = req.params
    let lastmonthEnd = `${(date.getFullYear()-1 == date.getFullYear() ? date.getFullYear() : date.getFullYear()-1)}-${String(date.getMonth() != 0 ? date.getMonth() : '12').padStart(2, '0')}-${String(nodaysinmonth).padStart(2, '0')}`
    //console.log("LastMonthStart "+todayDate)
    //console.log("Last Month End "+lastmonthEnd)


    // MockTradeDetails.find({order_timestamp: {$regex: todayDate}})
    let pipeline = [{ $match: { trade_time : {$gte : `${todayDate} 00:00:00`, $lte: `${lastmonthEnd} 23:59:59` }} },
        { $group: { _id: {},
                    amount: {
                        $sum: { $round : [{$toDouble : "$amount"}, 0]}
                    },
                    brokerage: {
                        $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                    },
                    trades: {
                        $count: {}
                    }} 
                    },
        { $sort: {_id: 1}},
        { $project: {_id : 0} }
    ]

let x = await MockTradeDetails.aggregate(pipeline)

    ////console.log(x);

res.status(201).json(x);

})

router.get("/readmocktradecompanyThisWeek/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    //console.log(date);
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log(todayDate);

    let weekday = date.getDay();
    //console.log("Weekday"+weekday);
    
    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 2);
    //console.log(nextDay);
    let nextDate = `${(nextDay.getFullYear())}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`

    var weekStartDay = new Date(day);
    weekStartDay.setDate(day.getDate() - weekday);
    ////console.log(String(weekStartDay).slice(0,10));
    let weekStartDate = `${(weekStartDay.getFullYear())}-${String(weekStartDay.getMonth() + 1).padStart(2, '0')}-${String(weekStartDay.getDate()).padStart(2, '0')}`

    MockTradeDetails.find({trade_time: {$gte:weekStartDate,$lt:nextDate}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })

})

router.get("/readmocktradecompanyThisMonth/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log(todayDate);

    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    //console.log(nextDay);

    let monthStart = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    MockTradeDetails.find({trade_time: {$gte:monthStart,$lt: nextDay}, userId: {$regex: email}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanyThisYear/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today Date"+todayDate);

    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    //console.log(nextDay);

    let yearStart = `${(date.getFullYear())}-01-01`
    //console.log(yearStart);
    //console.log(email);
    MockTradeDetails.find({trade_time: {$gte:yearStart,$lt:nextDay}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/updatemocktradedatatradetime", async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // //console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
   
    ////console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            // //console.log(datatoupdate[i]);
            if(!datatoupdate[i].trade_time){
            let datetime = datatoupdate[i].order_timestamp.split(" ");
            let datepart = datetime[0];
            let datetoupdate = datetime[0].split("-");
            let timepart = datetime[1]; 
            let trade_time = `${datetoupdate[2]}-${datetoupdate[1]}-${datetoupdate[0]} ${datetime[1]}`
            //console.log(trade_time);

            await MockTradeDetails.findByIdAndUpdate(datatoupdate[i]._id, {trade_time : trade_time},
                function (err, trade_time) {
                    if (err){
                        //console.log(err)
                    }
                    else{
                        //console.log("Trade Time : ", trade_time);
                    }
        }).clone();
        }
    }
})

router.get("/updatemocktradedataamount", async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // //console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
    //console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            if(!datatoupdate[i].amount){
            ////console.log(datatoupdate[i]);
            await MockTradeDetails.findByIdAndUpdate(datatoupdate[i]._id, {amount : Number(datatoupdate[i].Quantity) * datatoupdate[i].average_price},
                function (err, amount) {
                    if (err){
                        //console.log(err)
                    }
                    else{
                        //console.log("Trade Time : ", amount);
                    }
        }).clone();
        }
    }
})

router.get("/readmocktradecompanytodaycount", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let data = MockTradeDetails.find({order_timestamp: {$regex: todayDate}}).sort({trade_time: -1})
    data.count((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/tcmocktradecompanytoday", (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const {email} = req.params
    //console.log(todayDate)
    let tcost = 0;
    MockTradeDetails.find({trade_time: {$regex: todayDate}})
    .then((data)=>{
        tcost = transactioncostcalculation(data);
        res.status(201).json(tcost);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/tcmocktradecompanyyesterday", (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const {email} = req.params
    //console.log(todayDate)
    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let tcost = 0;
    MockTradeDetails.find({trade_time: {$regex: yesterdayDate}})
    .then((data)=>{
        tcost = transactioncostcalculation(data);
        res.status(201).json(tcost);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

// router.get("/tcmocktradecompanydayminu/:days", (req, res)=>{
//     const {days} = req.params
//     let date = new Date();
//     let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
//     //console.log(todayDate)
//     var day = new Date(todayDate);
//     //console.log(day); // Apr 30 2000

//     var yesterday = new Date(day);
//     yesterday.setDate(day.getDate() - days);
//     let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
//     let tcost = 0;
//     MockTradeDetails.find({trade_time: {$regex: yesterdayDate}})
//     .then((data)=>{
//         tcost = transactioncostcalculation(data);
//         res.status(201).json(tcost);
//     })
//     .catch((err)=>{
//         return res.status(422).json({error : "date not found"})
//     })
// })

router.get("/tcmocktradecompanylastfivedays", (req, res)=>{
    const days = 5
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log(todayDate)
    var day = new Date(todayDate);
    //console.log("Day"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    //console.log("StartDate"+yesterday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let tcost = [];
    MockTradeDetails.aggregate([
        {$match : {trade_time: {$gte:yesterdayDate,$lt:todayDate}}}]
        
        )
    .then((data)=>{
        //console.log("Data"+data)
        tcost = transactioncostcalculation(data);
        res.status(201).json(tcost);
        
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/gettcostmocktradecompanylastfivedays", async(req, res)=>{
    //console.log("Inside Aggregate API")
    const days = 5
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log(todayDate)
    var day = new Date(todayDate);
    //console.log("Day"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    //console.log("StartDate"+yesterday);
    //{ trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} }
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let x = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$gte: `${yesterdayDate} 00:00:00`, $lte: `${todayDate} 23:59:59`} } },
        { $group: { _id :{$substr: ['$trade_time', 0, 10]}, brokerage : { $sum : {$toDouble : "$brokerage"} } }} ,
        { $sort:{ _id: 1 }}
            ])
            
                ////console.log(x)
            
    ////console.log("Data"+x)
    // .then((data)=>{

        res.status(201).json(x);
        
    // })
    // .catch((err)=>{
    //     return res.status(422).json({error : "date not found"})
    // })
})

router.get("/updatemocktradedatadatefield", async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // //console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
   
    ////console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            // //console.log(datatoupdate[i]);
            if(!datatoupdate[i].date_part){
            let datetime = datatoupdate[i].trade_time.split(" ");
            let datepart = datetime[0];
            
            let date_part = datepart;
            //console.log(date_part);

            await MockTradeDetails.findByIdAndUpdate(datatoupdate[i]._id, {date_part : datepart},
                function (err, data) {
                    if (err){
                        //console.log(err)
                    }
                    else{
                        //console.log("Date Part : ", data);
                    }
        }).clone();
        }
    }
})

router.get("/readmocktradecompanyagg",async (req, res)=>{
    let date = new Date();
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')-1}`
//$gte : `${todayDate} 00:00:00`, 
   let x = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$lte : `${yesterdayDate} 00:00:00`} } },
        { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
        { $sort:{ _id: -1 }}
     ])
                ////console.log(x)

        res.status(201).json(x);
})
//{ trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} }
router.get("/readmocktradecompanytodayagg",async (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let x = await MockTradeDetails.aggregate([
         { $match: { trade_time: {$gte : `${todayDate} 00:00:00`, $lte : `${todayDate} 23:59:59`} } },
         { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
         { $sort:{ _id: -1 }}
      ])
                 ////console.log(x)
 
         res.status(201).json(x);
 })

 router.get("/getpnlmocktradecompanylastfivedays", async(req, res)=>{
    //console.log("Inside Aggregate API - Last 5 days chart data")
    const days = 6
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    //console.log(todayDate)
    var day = new Date(todayDate);
    //console.log("ToDay Date :"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    //console.log("StartDate"+yesterday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let x = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$gte :`${yesterdayDate} 00:00:00`, $lte: `${todayDate} 23:59:59` }, status: "COMPLETE"} },
        { $group: { _id: {
                                "date": {$substr : ["$trade_time",0,10]},
                            },
                    amount: {
                        $sum: "$amount"
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    trades: {
                        $count: {}
                    }} 
                    },
        { $sort: {_id: 1}}
            ])
            
                ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getpnlmocktradecompanydailythismonth", async(req, res)=>{
    //console.log("Inside Aggregate API - Last 5 days chart data")
    const days = 6
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    //console.log(todayDate)
    var day = new Date(todayDate);
    //console.log("ToDay Date :"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    //console.log("StartDate"+yesterday);

    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    let x = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$gte :`${yesterdayDate} 00:00:00`, $lte: `${todayDate} 23:59:59` }, status: "COMPLETE"} },
        { $group: { _id: {
                                "date": {$substr : ["$trade_time",0,10]},
                            },
                    amount: {
                        $sum: "$amount"
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    trades: {
                        $count: {}
                    }} 
                    },
        { $sort: {_id: 1}}
            ])
            
                ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailsthisweek", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Week")
     
    let date = new Date(); 
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    var day = new Date(todayDate);
    //console.log("Day "+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    //console.log("Yesterday "+yesterday);
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    var startday = new Date(day);
    startday.setDate(day.getDate() - days);
    //console.log("StartDate "+startday);

    let startdayDate = `${(startday.getFullYear())}-${String(startday.getMonth() + 1).padStart(2, '0')}-${String(startday.getDate()).padStart(2, '0')}`
    let pipeline = [{ $match: { trade_time : {$gte : `${startdayDate} 00:00:00`, $lte: `${yesterdayDate} 23:59:59` }, status: "COMPLETE"} },
                    { $group: { _id: {},
                                amount: {
                                    $sum: { $round : [{$toDouble : "$amount"}, 0]}
                                },
                                brokerage: {
                                    $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                                },
                                trades: {
                                    $count: {}
                                }} 
                                },
                    { $sort: {_id: 1}},
                    { $project: {_id : 0} }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailslastweek", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Last Week")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    var day = new Date(todayDate);
    //console.log("Day "+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - (days+1));
    //console.log("Yesterday "+yesterday);
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    //console.log("EndDate: "+yesterdayDate);

    var startday = new Date(day);
    startday.setDate(day.getDate() - (7+days));
    // //console.log("StartDate "+startday);

    let startdayDate = `${(startday.getFullYear())}-${String(startday.getMonth() + 1).padStart(2, '0')}-${String(startday.getDate()).padStart(2, '0')}`
    //console.log("StartDate "+startdayDate);
    let pipeline = [{ $match: { trade_time : {$gte : `${startdayDate} 00:00:00`, $lte: `${yesterdayDate} 23:59:59` }, status: "COMPLETE"} },
                    { $group: { _id: {},
                                amount: {
                                    $sum: { $round : [{$toDouble : "$amount"}, 0]}
                                },
                                brokerage: {
                                    $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                                },
                                trades: {
                                    $count: {}
                                }} 
                                },
                    { $sort: {_id: 1}},
                    { $project: {_id : 0} }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                // ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailsthismonth", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Month")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    var day = new Date(todayDate);
    //console.log("Day "+day); // Apr 30 2000

    var month = day.getMonth();
    var year = day.getFullYear();
    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    //console.log("Yesterday "+yesterday);
    let monthStartDate = `${(day.getFullYear())}-${String(day.getMonth() + 1).padStart(2, '0')}-01`

    var startday = new Date(day);
    startday.setDate(day.getDate() - days);
    //console.log("StartDate "+startday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let pipeline = [{ $match: { trade_time : {$gte : `${monthStartDate} 00:00:00`, $lte: `${yesterdayDate} 23:59:59` }, status: "COMPLETE"} },
                    { $group: { _id: {},
                                amount: {
                                    $sum: { $round : [{$toDouble : "$amount"}, 0]}
                                },
                                brokerage: {
                                    $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                                },
                                trades: {
                                    $count: {}
                                }} 
                                },
                    { $sort: {_id: 1}},
                    { $project: {_id : 0} }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailsthisyear", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Year")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    var day = new Date(todayDate);
    //console.log("Day "+day); // Apr 30 2000

    var month = day.getMonth();
    var year = day.getFullYear();
    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    //console.log("Yesterday "+yesterday);
    let monthStartDate = `${(day.getFullYear())}-01-01`

    var startday = new Date(day);
    startday.setDate(day.getDate() - days);
    //console.log("StartDate "+startday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let pipeline = [{ $match: { trade_time : {$gte : `${monthStartDate} 00:00:00`, $lte: `${yesterdayDate} 23:59:59` }, status: "COMPLETE"} },
                    { $group: { _id: {},
                                amount: {
                                    $sum: { $round : [{$toDouble : "$amount"}, 0]}
                                },
                                brokerage: {
                                    $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                                },
                                trades: {
                                    $count: {}
                                }} 
                                },
                    { $sort: {_id: 1}},
                    { $project: {_id : 0} }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailslastyear", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Year")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear()-1)}-${String('01').padStart(2, '0')}-${String('01').padStart(2, '0')}`
    //console.log("Today "+todayDate)
    var day = new Date(todayDate);
    //console.log("Day "+day); // Apr 30 2000

    var month = day.getMonth();
    var year = day.getFullYear();
    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    //console.log("Yesterday "+yesterday);
    let monthStartDate = `${(day.getFullYear())}-01-01`

    var startday = new Date(day);
    startday.setDate(day.getDate() - days);
    // //console.log("StartDate "+startday);

    let yesterdayDate = `${(date.getFullYear()-1)}-${String('12').padStart(2, '0')}-${String('31').padStart(2, '0')}`
    //console.log(yesterdayDate);
    let pipeline = [{ $match: { trade_time : {$gte :`${todayDate} 00:00:00`, $lte: `${yesterdayDate} 23:59:59` }, status: "COMPLETE"} },
                    { $group: { _id: {},
                                amount: {
                                    $sum: { $round : [{$toDouble : "$amount"}, 0]}
                                },
                                brokerage: {
                                    $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                                },
                                trades: {
                                    $count: {}
                                }} 
                                },
                    { $sort: {_id: 1}},
                    { $project: {_id : 0} }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailsyesterday", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Yesterday")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    var day = new Date(todayDate);
    //console.log("Day "+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    //console.log("Yesterday "+yesterday);


    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    //console.log("Yesterday Date :"+yesterdayDate)
    let pipeline = [{ $match: { trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} , status: "COMPLETE"} },
                    { $group: { _id: {},
                                amount: {
                                    $sum: { $round : [{$toDouble : "$amount"}, 0]}
                                },
                                brokerage: {
                                    $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                                },
                                trades: {
                                    $count: {}
                                }} 
                                },
                    { $sort: {_id: 1}},
                    { $project: {_id : 0} }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                // ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getoverallpnlmocktradecompanytoday", async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            "algoBox.isDefault": true
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})



router.get("/gettraderwisepnlmocktradecompanytoday", async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$gte: `${todayDate} 00:00:00` , $lte: `${todayDate} 23:59:59`}, status: "COMPLETE", "algoBox.isDefault": true} },
        
        { $group: { _id: {
                                "traderId": "$userId",
                                "traderName": "$createdBy",
                                "symbol": "$instrumentToken",
                                "algoId": "$algoBox._id",
                                "algoName": "$algoBox.algoName"
                            },
                    amount: {
                        $sum: {$multiply : ["$amount", -1]}
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    lots: {
                        $sum: {$toInt : "$Quantity"}
                    },
                    trades: {
                        $count: {}
                    },
                    lotUsed: {
                        $sum: {$abs : {$toInt : "$Quantity"}}
                    }
                    }},
            { $sort: {_id: -1}},
        
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getlastestmocktradecompany", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Latest Order")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}} },
                    { $project: { "_id" : 0,"trade_time" : 1,  "createdBy" : 1, "buyOrSell" : 1, "Quantity" : 1, "symbol" : 1 , "status" : 1 } },
                    { $sort: { "trade_time": -1 }},
                    { $limit : 1}
                ]

    let x = await MockTradeDetails.aggregate(pipeline)

        res.status(201).json(x[0]);
        
})

router.get("/getavgpricemocktradecompany", async(req, res)=>{
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}, status: "COMPLETE"} },

                    { $sort: { "trade_time": 1 }},
                   { $group:
                            {
                                _id: {
                     
                                    "product": "$Product",
                                    "symbol": "$symbol"
                                },
                                average_price: { $last: "$average_price" }
                            }
                        },
                        { $sort: { "_id": 1 }}
                    
                ]

    let getAvgPrice = await MockTradeDetails.aggregate(pipeline)
            
                // //console.log(getAvgPrice);

        res.status(201).json(getAvgPrice);
})

router.get("/getmocktradecompanydetailsdaybeforeyesterday", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Yesterday")
    let todayDate = new Date();
    var day = new Date(todayDate);
    //console.log("Day "+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 2);
    //console.log("Yesterday "+yesterday);
    // let todayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    //console.log("Yesterday Date :"+yesterdayDate)
    let pipeline = [{ $match: { trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} , status: "COMPLETE"} },
                    { $group: { _id: {},
                                amount: {
                                    $sum: { $round : [{$toDouble : "$amount"}, 0]}
                                },
                                brokerage: {
                                    $sum: { $round : [{$toDouble : "$brokerage"}, 0]}
                                },
                                trades: {
                                    $count: {}
                                }} 
                                },
                    { $sort: {_id: 1}},
                    { $project: {_id : 0} }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                ////console.log(x);

        res.status(201).json(x);
        
})

router.get("/getlastfivemocktradecompany", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details of last 5 Order")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate} , status: "COMPLETE"} },
                    { $project: { "_id" : 0,"trade_time" : 1,  "createdBy" : 1, "buyOrSell" : 1, "Quantity" : 1, "symbol" : 1  } },
                    { $sort: { "trade_time": -1 }},
                    { $limit: 5 }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)

        res.status(201).json(x);
        
})


router.get("/daywisecompanypnl", async(req, res)=>{
    //console.log("Inside Aggregate API - Day wise company pnl")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [ {$match: { status: "COMPLETE"}},
                    { $group :
                            { _id: {
                                "date": {$substr: [ "$trade_time", 0, 10 ]},
                            },
                    amount: {
                        $sum: "$amount"
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    }
                }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)

        res.status(201).json(x);
        
})

router.get("/datewisecompanypnl/:queryDate", async(req, res)=>{
    //console.log("Inside Aggregate API - Date wise company pnl based on date entered")
    let {queryDate} = req.params
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [ {$match: {
                        trade_time : {$gte : `${queryDate} 00:00:00`, $lte : `${queryDate} 23:59:59`},
                        status : "COMPLETE" 
                    }
                        // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                    },
                    { $group :
                            { _id: {
                                "date": {$substr: [ "$trade_time", 0, 10 ]},
                            },
                    amount: {
                        $sum: "$amount"
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    trades: {
                        $count: {}
                    },
                    }
                }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)

        res.status(201).json(x);
        
})


router.get("/companypnlreport/:startDate/:endDate", async(req, res)=>{
    //console.log("Inside Aggregate API - Date wise company pnl based on date entered")
    let {startDate,endDate} = req.params
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [ {$match: {
                        trade_time : {$gte : `${startDate} 00:00:00`, $lte : `${endDate} 23:59:59`},
                        status : "COMPLETE" 
                    }
                        // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                    },
                    { $group :
                            { _id: {
                                "date": {$substr: [ "$trade_time", 0, 10 ]},
                            },
                    gpnl: {
                        $sum: {$multiply : ["$amount",-1]}
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    trades: {
                        $count: {}
                    },
                    }
                },
                { $addFields: 
                    {
                    npnl : { $subtract : ["$gpnl","$brokerage"]},
                    dayOfWeek : {$dayOfWeek : { $toDate : "$_id.date"}}
                    }
                    },
                { $sort :
                    { _id : 1 }
                }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)

        res.status(201).json(x);
        
})

router.get("/traderwisecompanypnlreport/:startDate/:endDate", async(req, res)=>{
    //console.log("Inside Aggregate API - Trader wise company pnl based on date entered")
    let {startDate,endDate} = req.params
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [ {$match: {
                        trade_time : {$gte : `${startDate} 00:00:00`, $lte : `${endDate} 23:59:59`},
                        status : "COMPLETE" 
                    }
                        // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                    },
                    { $group :
                            { _id: "$createdBy",
                            gpnl: {
                              $sum: {$multiply : ["$amount",-1]}
                            },
                            brokerage : {
                              $sum: {$toDouble : "$brokerage"}
                            },
                            trades : {
                              $count : {}
                            },
                    }
                },
                { $addFields: 
                    {
                        npnl: {$subtract : ["$gpnl" , "$brokerage"]}
                    }
                    },
                { $sort :
                    { npnl: -1 }
                }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)

        res.status(201).json(x);
        
})


router.get("/getoverallpnlmocktradeparticularusertodaycompanyside/:email", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            userId: email
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchange: "$exchange"
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})


router.get("/getMockTradeDetailsUser/:email", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            userId: email
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchange: "$exchange",
              validity: "$validity",
              order_type: "$order_type",
              variety: "$variety",
              algoBoxName: "$algoBox.algoName",
              name: "$tradeBy"
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              }
            }
          }
        }
      ])
    res.status(201).json(pnlDetails);
})

router.get("/getoverallpnlmocktradecompanytoday/algowisedata/:algoId", async(req, res)=>{
    let date = new Date();
    const {algoId} = req.params;
    console.log( date, algoId)
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            "algoBox._id": algoId
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            

        res.status(201).json(pnlDetails);

})

router.get("/getMockTradeDetailsAllUser", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchange: "$exchange",
              validity: "$validity",
              order_type: "$order_type",
              variety: "$variety",
              algoBoxName: "$algoBox.algoName",
              name: "$tradeBy",
              userId: "$userId"
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              }
            }
          }
        }
      ])
    res.status(201).json(pnlDetails);
})


router.get("/gettraderwisepnlmocktradecompanytoday/algowiseData/:id", async(req, res)=>{
    let date = new Date();
    const {id} = req.params;
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$gte: `${todayDate} 00:00:00` , $lte: `${todayDate} 23:59:59`}, status: "COMPLETE",  "algoBox._id": id} },
        
        { $group: { _id: {
                                "traderId": "$userId",
                                "traderName": "$createdBy",
                                "symbol": "$instrumentToken"
                            },
                    amount: {
                        $sum: {$multiply : ["$amount", -1]}
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    lots: {
                        $sum: {$toInt : "$Quantity"}
                    },
                    trades: {
                        $count: {}
                    },
                    lotUsed: {
                        $sum: {$abs : {$toInt : "$Quantity"}}
                    }
                    }},
            { $sort: {_id: -1}},
        
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})


router.get("/updatealgoid", async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // //console.log(todayDate)
    let algoiddoc = await MockTradeDetails.find()
    //console.log(datatoupdate);
  
  
        for(let i = 0; i< algoiddoc.length; i++ ){
            if(!algoiddoc[i].algoBox.isDefault && !algoiddoc[i].algoBox.marginDeduction){
            console.log(algoiddoc[i]._id);
            await MockTradeDetails.findByIdAndUpdate(algoiddoc[i]._id, {'algoBox.isDefault' : true,'algoBox.marginDeduction' : false},
                function (err, algoBox) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("Is Default : ", algoiddoc[i].algoBox.isDefault,algoBox);
                    }
        }).clone();
        }
    }
  })

module.exports = router;
