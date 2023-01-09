const express = require("express");
const router = express.Router();
const transactioncostcalculation = require("../transactioncostcalculation");
require("../../db/conn");
const MockTradeDetails = require("../../models/mock-trade/mockTradeCompanySchema");
const MockTradeDetailsUser = require("../../models/mock-trade/mockTradeUserSchema");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const LiveTradeDetails = require("../../models/TradeDetails/liveTradeSchema");
const axios = require('axios');

router.post("/mocktradecompany", async (req, res)=>{

    let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
         TriggerPrice, stopLoss, validity, variety, last_price, createdBy, userId,
          createdOn, uId, algoBox, order_id, instrumentToken, realTrade, realBuyOrSell, realQuantity} = req.body
        console.log(req.body);
        console.log("in the company auth");
    const {algoName, transactionChange, instrumentChange
        , exchangeChange, lotMultipler, productChange, tradingAccount} = algoBox

        const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
        const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});

        // let livetradeData;
        // if(realTrade){
        //     livetradeData = await LiveTradeDetails.find({uId : uId});
        // }

        // let checkingLive = await LiveTradeDetails.find();
        // console.log(uId);
        // console.log("checkingLive", checkingLive);

    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety || !last_price || !algoName || !transactionChange || !instrumentChange || !exchangeChange || !lotMultipler || !productChange || !tradingAccount || !instrumentToken){
        console.log(Boolean(exchange)); console.log(Boolean(symbol)); console.log(Boolean(buyOrSell)); console.log(Boolean(Quantity)); console.log(Boolean(Product)); console.log(Boolean(OrderType)); console.log(Boolean(validity)); console.log(Boolean(variety)); console.log(Boolean(last_price)); console.log(Boolean(algoName)); console.log(Boolean(transactionChange)); console.log(Boolean(instrumentChange)); console.log(Boolean(exchangeChange)); console.log(Boolean(lotMultipler)); console.log(Boolean(productChange)); console.log(Boolean(tradingAccount));
        console.log("data nhi h pura");
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        realQuantity = "-"+realQuantity;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let originalLastPrice;
    let newTimeStamp = "";
    let trade_time = "";
    try{
        
        let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
        
        for(let elem of liveData.data){
            console.log(elem)
            if(elem.instrument_token == instrumentToken){
                newTimeStamp = elem.timestamp;
                originalLastPrice = elem.last_price;
                console.log("originalLastPrice 38 line", originalLastPrice)
            }
        }

        trade_time = newTimeStamp;
        let firstDateSplit = (newTimeStamp).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        newTimeStamp = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]} ${firstDateSplit[1]}`


    } catch(err){
        return new Error(err);
    }

    console.log("newTimeStamp", newTimeStamp);


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

    let brokerageUser;
    let brokerageCompany;

    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPrice);
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPrice);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPrice);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPrice);
    }
 

    // console.log("livetradeData", livetradeData)
    MockTradeDetails.findOne({uId : uId})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }

        const mockTradeDetails = new MockTradeDetails({
            status:"COMPLETE", uId, createdBy, average_price: originalLastPrice, Quantity: realQuantity, 
            Product, buyOrSell:realBuyOrSell, order_timestamp: newTimeStamp,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "ninepointer", userId,
                algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
            lotMultipler, productChange, tradingAccount}, order_id, instrumentToken, brokerage: brokerageCompany,
            tradeBy: createdBy, isRealTrade: false, amount: (Number(realQuantity)*originalLastPrice), trade_time:trade_time
        });

        console.log("mockTradeDetails comapny", mockTradeDetails);
        mockTradeDetails.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        
    }).catch(err => {console.log(err, "fail")});

    MockTradeDetailsUser.findOne({uId : uId})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }

        const mockTradeDetailsUser = new MockTradeDetailsUser({
            status:"COMPLETE", uId, createdBy, average_price: originalLastPrice, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "ninepointer", userId,
            isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, 
            tradeBy: createdBy, amount: (Number(Quantity)*originalLastPrice), trade_time:trade_time
        });

        console.log("mockTradeDetails", mockTradeDetailsUser);
        mockTradeDetailsUser.save().then(()=>{
            // res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> {
            // res.status(500).json({error:"Failed to enter data"})
        });
        

    }).catch(err => {console.log(err, "fail")});
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
    console.log(date);
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log(todayDate);

    let daytosubs = 1;
    console.log("Days to Subs"+daytosubs);
    
    var day = new Date(todayDate);
    console.log(day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - daytosubs);
    console.log(String(yesterday).slice(0,10));
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    console.log(yesterdayDate);

    MockTradeDetails.count({trade_time: {$regex: yesterdayDate}},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })

})

router.get("/readmocktradecompany/:id", (req, res)=>{
    console.log(req.params)
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
    console.log(todayDate)
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
    console.log(req.params)
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
    console.log(todayDate);
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
    console.log(todayDate)
    // MockTradeDetails.find({order_timestamp: {$regex: todayDate}})
    MockTradeDetails.find({trade_time: {$gte:monthStart,$lt: todayDate}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradecompanyThisWeek/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    console.log(date);
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log(todayDate);

    let weekday = date.getDay();
    console.log("Weekday"+weekday);
    
    var day = new Date(todayDate);
    console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 2);
    console.log(nextDay);
    let nextDate = `${(nextDay.getFullYear())}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`

    var weekStartDay = new Date(day);
    weekStartDay.setDate(day.getDate() - weekday);
    //console.log(String(weekStartDay).slice(0,10));
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
    console.log(todayDate);

    var day = new Date(todayDate);
    console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    console.log(nextDay);

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
    console.log("Today Date"+todayDate);

    var day = new Date(todayDate);
    console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    console.log(nextDay);

    let yearStart = `${(date.getFullYear())}-01-01`
    console.log(yearStart);
    console.log(email);
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
    // console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
   
    //console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            // console.log(datatoupdate[i]);
            if(!datatoupdate[i].trade_time){
            let datetime = datatoupdate[i].order_timestamp.split(" ");
            let datepart = datetime[0];
            let datetoupdate = datetime[0].split("-");
            let timepart = datetime[1]; 
            let trade_time = `${datetoupdate[2]}-${datetoupdate[1]}-${datetoupdate[0]} ${datetime[1]}`
            console.log(trade_time);

            await MockTradeDetails.findByIdAndUpdate(datatoupdate[i]._id, {trade_time : trade_time},
                function (err, trade_time) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("Trade Time : ", trade_time);
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
    // console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
    console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            if(!datatoupdate[i].amount){
            //console.log(datatoupdate[i]);
            await MockTradeDetails.findByIdAndUpdate(datatoupdate[i]._id, {amount : Number(datatoupdate[i].Quantity) * datatoupdate[i].average_price},
                function (err, amount) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("Trade Time : ", amount);
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
    console.log(todayDate)
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
    console.log(todayDate)
    var day = new Date(todayDate);
    console.log(day); // Apr 30 2000

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
//     console.log(todayDate)
//     var day = new Date(todayDate);
//     console.log(day); // Apr 30 2000

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
    console.log(todayDate)
    var day = new Date(todayDate);
    console.log("Day"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    console.log("StartDate"+yesterday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let tcost = [];
    MockTradeDetails.aggregate(
        {trade_time: {$gte:yesterdayDate,$lt:todayDate}},
        
        )
    .then((data)=>{
        console.log("Data"+data)
        tcost = transactioncostcalculation(data);
        res.status(201).json(tcost);
        
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})



router.get("/gettcostmocktradecompanylastfivedays", async(req, res)=>{
    console.log("Inside Aggregate API")
    const days = 7
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log(todayDate)
    var day = new Date(todayDate);
    console.log("Day"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    console.log("StartDate"+yesterday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let x = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$gte:yesterdayDate,$lt:todayDate} } },
        { $group: { _id : '$date_part', brokerage : { $sum : {$toDouble : "$brokerage"} } }} ,
        { $sort:{ _id: 1 }}
            ])
            
                console.log(x)
            
    //console.log("Data"+x)
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
    // console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
   
    //console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            // console.log(datatoupdate[i]);
            if(!datatoupdate[i].date_part){
            let datetime = datatoupdate[i].trade_time.split(" ");
            let datepart = datetime[0];
            
            let date_part = datepart;
            console.log(date_part);

            await MockTradeDetails.findByIdAndUpdate(datatoupdate[i]._id, {date_part : datepart},
                function (err, data) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("Date Part : ", data);
                    }
        }).clone();
        }
    }
})

router.get("/readmocktradecompanyagg",async (req, res)=>{
   let x = await MockTradeDetails.aggregate([
        { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
        { $sort:{ _id: -1 }}
     ])
                console.log(x)

        res.status(201).json(x);
})

router.get("/readmocktradecompanytodayagg",async (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let x = await MockTradeDetails.aggregate([
         { $match: {date_part: todayDate} },
         { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
         { $sort:{ _id: -1 }}
      ])
                 console.log(x)
 
         res.status(201).json(x);
 })

 router.get("/getpnlmocktradecompanylastfivedays", async(req, res)=>{
    console.log("Inside Aggregate API")
    const days = 7
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log(todayDate)
    var day = new Date(todayDate);
    console.log("Day"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    console.log("StartDate"+yesterday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let x = await MockTradeDetails.aggregate([
        { $match: { date_part : {$gte :yesterdayDate, $lte: todayDate }} },
        { $group: { _id: {
                                "date": "$date_part",
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
            
                console.log(x);

        res.status(201).json(x);
        
})


router.get("/getmocktradecompanydetailsthisweek", async(req, res)=>{
    console.log("Inside Aggregate API - Mock Trade Details Week")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log("Today "+todayDate)
    var day = new Date(todayDate);
    console.log("Day "+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    console.log("Yesterday "+yesterday);
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    var startday = new Date(day);
    startday.setDate(day.getDate() - days);
    console.log("StartDate "+startday);

    let startdayDate = `${(startday.getFullYear())}-${String(startday.getMonth() + 1).padStart(2, '0')}-${String(startday.getDate()).padStart(2, '0')}`
    let pipeline = [{ $match: { date_part : {$gte :'2023-01-01', $lte: '2023-01-07' }} },
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
            
                console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailsthismonth", async(req, res)=>{
    console.log("Inside Aggregate API - Mock Trade Details Month")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log("Today "+todayDate)
    var day = new Date(todayDate);
    console.log("Day "+day); // Apr 30 2000

    var month = day.getMonth();
    var year = day.getFullYear();
    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    console.log("Yesterday "+yesterday);
    let monthStartDate = `${(day.getFullYear())}-${String(day.getMonth() + 1).padStart(2, '0')}-"01"`

    var startday = new Date(day);
    startday.setDate(day.getDate() - days);
    console.log("StartDate "+startday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let pipeline = [{ $match: { date_part : {$gte :monthStartDate, $lte: yesterdayDate }} },
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
            
                console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailsthisyear", async(req, res)=>{
    console.log("Inside Aggregate API - Mock Trade Details Year")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log("Today "+todayDate)
    var day = new Date(todayDate);
    console.log("Day "+day); // Apr 30 2000

    var month = day.getMonth();
    var year = day.getFullYear();
    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    console.log("Yesterday "+yesterday);
    let monthStartDate = `${(day.getFullYear())}-01-01`

    var startday = new Date(day);
    startday.setDate(day.getDate() - days);
    console.log("StartDate "+startday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let pipeline = [{ $match: { date_part : {$gte :monthStartDate, $lte: yesterdayDate }} },
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
            
                console.log(x);

        res.status(201).json(x);
        
})

router.get("/getmocktradecompanydetailsyesterday", async(req, res)=>{
    console.log("Inside Aggregate API - Mock Trade Details Yesterday")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log("Today "+todayDate)
    var day = new Date(todayDate);
    console.log("Day "+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 1);
    console.log("Yesterday "+yesterday);


    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    console.log("Yesterday Date :"+yesterdayDate)
    let pipeline = [{ $match: { date_part : yesterdayDate } },
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
            
                console.log(x);

        res.status(201).json(x);
        
})


router.get("/getoverallpnlmocktradecompanytoday", async(req, res)=>{
    // console.log("Inside Aggregate API")
    // const days = 7
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // console.log(todayDate)
    // var day = new Date(todayDate);
    // console.log("Day"+day); // Apr 30 2000

    // var yesterday = new Date(day);
    // yesterday.setDate(day.getDate() - days);
    // console.log("StartDate"+yesterday);

    // let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$regex: todayDate}} },
        
        { $group: { _id: {
                                "symbol": "$symbol",
                                "Product": "$Product",
                                "buyOrSell": "$buyOrSell"
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
                    average_price: {
                        $sum: {$toInt : "$average_price"}
                        // average_price: "$average_price"
                    },
                    }},
             { $sort: {_id: -1}},
            ])
            
                console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/gettraderwisepnlmocktradecompanytoday", async(req, res)=>{
    // console.log("Inside Aggregate API")
    // const days = 7
    // let date = new Date();
    // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // console.log(todayDate)
    // var day = new Date(todayDate);
    // console.log("Day"+day); // Apr 30 2000

    // var yesterday = new Date(day);
    // yesterday.setDate(day.getDate() - days);
    // console.log("StartDate"+yesterday);

    // let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$regex: "2023-01-06"}} },
        { $sort: {trade_time: -1}},
        { $group: { _id: {
                                "traderId": "$userId",
                                "buyOrSell": "$buyOrSell",
                                "traderName": "$createdBy"
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
                    average_price: {
                        $sum: {$toInt : "$average_price"}
                        // average_price: "$average_price"
                    },
                    }},
        
            ])
            
                console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

module.exports = router;
