const express = require("express");
const router = express.Router();
const pnlcalucationnorunninglots = require("../pnlcalculation");
const pnlcalucationnorunninglotsuser = require("../userpnlcalculation");
const UserDetails = require("../../models/User/userDetailSchema");
require("../../db/conn");
const MockTradeDetails = require("../../models/mock-trade/mockTradeUserSchema");
const axios = require('axios');


router.post("/mocktradeuser", async (req, res)=>{

    let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
         TriggerPrice, stopLoss, validity, variety, last_price, createdBy, userId,
          createdOn, uId, isRealTrade, order_id, instrumentToken} = req.body

          console.log(req.body);
          console.log("in the company auth");

    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety || !last_price || !instrumentToken){
        console.log(exchange); console.log(symbol); console.log(buyOrSell); console.log(Quantity); console.log(Product); console.log(OrderType); console.log(validity); console.log(variety); console.log(last_price); console.log(instrumentToken);
        console.log(req.body);
        console.log("data nhi h pura");
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let originalLastPrice;
    let a;
    try{
        
        let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
        for(let elem of liveData.data){
            if(elem.instrument_token == instrumentToken){

                originalLastPrice = elem.last_price;
                console.log("originalLastPrice 38 line", originalLastPrice)
            }
        }

    } catch(err){
        return new Error(err);
    }

    console.log("originalLastPrice", a)
})

router.get("/readmocktradeuser", (req, res)=>{
    MockTradeDetails.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.get("/readmocktradeuser/:id", (req, res)=>{
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

router.get("/readmocktradeuseremail/:email", (req, res)=>{
    const {email} = req.params
    MockTradeDetails.find({userId: email}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeusercountTodaybyemail/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

    MockTradeDetails.count({order_timestamp: {$regex: todayDate}, userId: email},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readmocktradecompanycountbyemail/:email", (req, res)=>{
    const {email} = req.params
    MockTradeDetails.count({userId: email},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readmocktradeuserpnl/:email/:status", (req, res)=>{
    const {email, status} = req.params
    MockTradeDetails.find({userId: email, status:status})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeuserDate/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    console.log(todayDate);
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeusertodaydatapagination/:email/:skip/:limit", (req, res)=>{
    const {email, skip, limit} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    console.log(todayDate);
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time: -1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeuserDate", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeusertodaydatapagination/:skip/:limit", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {skip, limit} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}}).sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeuserpagination/:email/:skip/:limit", (req, res)=>{
    const {email, skip, limit} = req.params
    MockTradeDetails.find({userId: email}).sort({trade_time: -1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeuserpagination/:skip/:limit", (req, res)=>{
    const {skip, limit} = req.params
    MockTradeDetails.find().sort({trade_time: -1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeuserpariculardatewithemail/:date/:email", (req, res)=>{
    const {date, email} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: date}, userId: email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeuserpariculardate/:date", (req, res)=>{
    const {date} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: date}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readmocktradeuserThisWeek/:email", (req, res)=>{
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

router.get("/readmocktradeuserThisMonth/:email", (req, res)=>{
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

router.get("/readmocktradeuserThisYear/:email", (req, res)=>{
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

router.get("/updatemocktradedatatradetimeuser", async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
   
    //console.log(datatoupdate);

   
        for(let i = 0; i< datatoupdate.length; i++ ){
            if(!datatoupdate[i].trade_time){
            // console.log(datatoupdate[i]);
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

router.get("/updatemocktradedataamountuser", async(req, res)=>{
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

router.get("/pnlcalucationmocktradeallusertoday", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}})
    .then((data)=>{

            let overallnewpnl = pnlcalucationnorunninglots(data);
            console.log(overallnewpnl);
    
        return res.status(200).send(overallnewpnl);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/pnlcalucationmocktradeusertoday", async(req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params

    MockTradeDetails.find({order_timestamp: {$regex: todayDate}})
    .then(async(data)=>{
        let overallnewpnl = await pnlcalucationnorunninglotsuser(data);
        console.log(overallnewpnl);
        //traderwisepnl.push(overallnewpnl);
        console.log(overallnewpnl);
        return res.status(200).send(overallnewpnl);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })

})

router.get("/pnlcalucationmocktradealluserthismonth", (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let monthStartDate = '2023-01-01';
    const {email} = req.params
    MockTradeDetails.find({trade_time: {$gte:monthStartDate,$lt:todayDate}})
    .then((data)=>{

            let overallnewpnl = pnlcalucationnorunninglots(data);
            console.log(overallnewpnl);
    
        return res.status(200).send(overallnewpnl);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/gettraderwisepnldetailsthismonth", async(req, res)=>{
    console.log("Inside Aggregate API - Mock Trade Details Day Before Yesterday")
    var day = new Date()
    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - 2);
    console.log("Yesterday "+yesterday);
    // let todayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    console.log("Yesterday Date :"+yesterdayDate)
    let pipeline = [{ $match: { trade_time: {$gte : '2023-01-01 00:00:00', $lte : '2023-01-10 23:59:59'} } },
                    { $project: { "createdBy" : 1 , "amount" : 1, "brokerage" : 1, "trade_time" : 1 }},
                    { $group: {
                                    _id: "$createdBy",
                                    gpnl: {
                                    $sum: "$amount"
                                    },
                                    brokerage: {
                                    $sum: {$toDouble : "$brokerage"}
                                    },
                                    trades: {
                                    $count: {}
                                    }
                                    
                                } 
                                },
                    { $sort: {gpnl: -1}}
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
                console.log(x);

        res.status(201).json(x);
        
})

router.get("/getavgpricemocktradeparticularuser/:email", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}, userId: email} },

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
            
                // console.log(getAvgPrice);

        res.status(201).json(getAvgPrice);
})

router.get("/getoverallpnlmocktradeparticularusertoday/:email", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$regex: todayDate}, userId: email} },
        
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
            
                // console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getlastestmocktradeparticularuser/:email", async(req, res)=>{
    console.log("Inside Aggregate API - Mock Trade Details Year")
    const {email} = req.params
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}, userId: email} },
                    { $project: { "_id" : 0,"trade_time" : 1,  "createdBy" : 1, "buyOrSell" : 1, "Quantity" : 1, "symbol" : 1  } },
                    { $sort: { "trade_time": -1 }}
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
        res.status(201).json(x[0]);
        
})

router.get("/getuserreportdatewise/:email/:firstDate/:secondDate", async(req, res)=>{
    const {email, firstDate, secondDate} = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$gte : `${firstDate} 00:00:00`, $lte : `${secondDate} 23:59:59`}, userId: email} },
        
        { $group: { _id: {
                             "date": {$substr: [ "$order_timestamp", 0, 10 ]},
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
                    noOfTrade: {
                        $count: {}
                        // average_price: "$average_price"
                    },
                    }},
             { $sort: {_id: -1}},
            ])
            
                // console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})


module.exports = router;
