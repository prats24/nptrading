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

          //console.log(req.body);
          //console.log("in the company auth");

    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety || !last_price || !instrumentToken){
        //console.log(exchange); //console.log(symbol); //console.log(buyOrSell); //console.log(Quantity); //console.log(Product); //console.log(OrderType); //console.log(validity); //console.log(variety); //console.log(last_price); //console.log(instrumentToken);
        //console.log(req.body);
        //console.log("data nhi h pura");
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
    let originalLastPrice;
    let a;
    try{
        
        let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
        for(let elem of liveData.data){
            if(elem.instrument_token == instrumentToken){

                originalLastPrice = elem.last_price;
                //console.log("originalLastPrice 38 line", originalLastPrice)
            }
        }

    } catch(err){
        return new Error(err);
    }

    //console.log("originalLastPrice", a)
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
    //console.log(todayDate);
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
    //console.log(todayDate);
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

router.get("/readmocktradeuserThisMonth/:email", (req, res)=>{
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

router.get("/readmocktradeuserThisYear/:email", (req, res)=>{
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

router.get("/updatemocktradedatatradetimeuser", async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // //console.log(todayDate)
    let datatoupdate = await MockTradeDetails.find()
   
    ////console.log(datatoupdate);

   
        for(let i = 0; i< datatoupdate.length; i++ ){
            if(!datatoupdate[i].trade_time){
            // //console.log(datatoupdate[i]);
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

router.get("/updatemocktradedataamountuser", async(req, res)=>{
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

router.get("/pnlcalucationmocktradeallusertoday", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    MockTradeDetails.find({order_timestamp: {$regex: todayDate}, status: "COMPLETE"})
    .then((data)=>{

            let overallnewpnl = pnlcalucationnorunninglots(data);
            //console.log(overallnewpnl);
    
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

    MockTradeDetails.find({order_timestamp: {$regex: todayDate}, status: "COMPLETE"})
    .then(async(data)=>{
        let overallnewpnl = await pnlcalucationnorunninglotsuser(data);
        //console.log(overallnewpnl);
        //traderwisepnl.push(overallnewpnl);
       //console.log(overallnewpnl);
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
    MockTradeDetails.find({trade_time: {$gte:monthStartDate,$lt:todayDate, status: "COMPLETE"}})
    .then((data)=>{

            let overallnewpnl = pnlcalucationnorunninglots(data);
            //console.log(overallnewpnl);
    
        return res.status(200).send(overallnewpnl);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/gettraderwisepnldetailsthismonth", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details traderwise till yesterday")
    var day = new Date()
    let dayDate = `${(day.getFullYear())}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}` 
    var yesterday = new Date(day);
    //console.log("Day :"+day)
    //console.log("Day Date :"+dayDate)
    //yesterday.setDate(day.getDate() - 1);
    let todayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-01`

    if(day >= `${dayDate} 15:30:00`){
        //console.log("Inside if statement")
        yesterday.setDate(day.getDate());
    }
    else{
        //console.log("Inside else statement")
        yesterday.setDate(day.getDate() - 1);
    }
    //console.log("Yesterday "+yesterday);
    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    //console.log("Yesterday Date :"+yesterdayDate)
    let pipeline = [{ $match: { trade_time: {$gte : `${todayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`},  status: "COMPLETE" } },
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
            
                //console.log(x);

        res.status(201).json(x);
        
})

router.get("/getavgpricemocktradeparticularuser/:email", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}, userId: email, status: "COMPLETE"} },

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

router.get("/getoverallpnlmocktradeparticularusertoday/:email", async(req, res)=>{
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

router.get("/getlastestmocktradeparticularuser/:email", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade Details Year")
    const {email} = req.params
    let date = new Date(); 
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
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
        { $match: { trade_time: {$gte : `${firstDate} 00:00:00`, $lte : `${secondDate} 23:59:59`}, userId: email, status: "COMPLETE"} },
        
        { $group: { _id: {
                             "date": {$substr: [ "$trade_time", 0, 10 ]},
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
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/gethistorymocktradesparticularuser/:email", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade today user trades")
    const {email} = req.params
    let date = new Date(); 
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$lt : todayDate}, userId: email} },
                    { $project: { "_id" : 0,"trade_time" : 1,  "createdBy" : 1, "buyOrSell" : 1, "Quantity" : 1, "symbol" : 1 , "order_id" : 1, "order_timestamp" : 1, "Product" : 1, "average_price" :1, "amount" :1, "status" : 1 } },
                    { $sort: { "trade_time": -1 }}
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
        res.status(201).json(x);
        
})

router.get("/gettodaysmocktradesparticularuser/:email", async(req, res)=>{
    //console.log("Inside Aggregate API - Mock Trade today user trades")
    const {email} = req.params
    let date = new Date(); 
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}, userId: email} },
                    { $project: { "_id" : 0,"trade_time" : 1,  "createdBy" : 1, "buyOrSell" : 1, "Quantity" : 1, "symbol" : 1 , "order_id" : 1, "order_timestamp" : 1, "Product" : 1, "average_price" :1, "amount" :1, "status" : 1 } },
                    { $sort: { "trade_time": -1 }}
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
        res.status(201).json(x);
        
})

router.get("/gettopfivelossmakingtradersthismonthmock", async(req, res)=>{
    //console.log("Inside Aggregate API - Top 5 loss making traders mock")
    let now = new Date(); 
    let nowDate = `${(now.getFullYear())}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    let month = now.getMonth()+1
    let year = now.getFullYear()
    let endDay = ''
    let startDate = ''
    if(now >= `${nowDate} 15:30:00`){
        endDay = new Date(now.getFullYear(),now.getMonth()+1,now.getDate());
    }
    else{
        endDay = new Date(now.getFullYear(),now.getMonth()+1,now.getDate()-1);
    }
    endDay = new Date(endDay);
    let endDate = `${(endDay.getFullYear())}-${String(endDay.getMonth() + 1).padStart(2, '0')}-${String(endDay.getDate()).padStart(2, '0')}`
    if(endDay.getFullYear() == year){
    startDate = `${(endDay.getFullYear())}-${String(month).padStart(2, '0')}-01`
    }
    else{
    startDate = `${(year-1)}-12-01`
    }
    
    //console.log("Start Date: "+startDate)
    //console.log("End Date: "+endDate)
    
    let pipeline = [{ $match: 
                    { trade_time : {$gte : `${startDate} 00:00:00`, $lte: `${endDate} 23:59:59`}} 
                    },
                    { $group: 
                    { _id: "$createdBy",
                    gpnl: {
                      $sum: {$multiply : ["$amount",-1]}
                    },
                    brokerage: {
                      $sum: {$toDouble : "$brokerage"}
                    },
                    trades: {
                      $count : {}
                    } } 
                    },
                    { $addFields:
                    { npnl: {$subtract : ["$gpnl","$brokerage"]} }
                    },
                    { $sort: 
                    { npnl: 1 }
                    },
                    { $limit:
                        5   
                    }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)
            
        res.status(201).json(x);
        
})
router.get("/readmocktradeuseragg",async (req, res)=>{
    let date = new Date();
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')-1}`
//$gte : `${todayDate} 00:00:00`, 
   let x = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$lte : `${yesterdayDate} 00:00:00`} } },
        { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,  "placed_by": 1 } },
        { $sort:{ _id: -1 }}
     ])
                ////console.log(x)

        res.status(201).json(x);
})
//{ trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} }
router.get("/readmocktradeusertodayagg",async (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let x = await MockTradeDetails.aggregate([
         { $match: { trade_time: {$gte : `${todayDate} 00:00:00`, $lte : `${todayDate} 23:59:59`} } },
         { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,  "placed_by": 1 } },
         { $sort:{ _id: -1 }}
      ])
                 ////console.log(x)
 
         res.status(201).json(x);
 })

 router.get("/tradermatrixpnlreport/:startDate/:endDate", async(req, res)=>{
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
                            { _id: { createdBy : "$createdBy", trade_time : {$substr : ["$trade_time",0,10]}},

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
                    { gpnl: -1 }
                }
                ]

    let x = await MockTradeDetails.aggregate(pipeline)

        res.status(201).json(x);
        
})

router.get("/traderwisetraderpnlreport/:startDate/:endDate", async(req, res)=>{
    //console.log("Inside Aggregate API - Trader wise trader pnl based on date entered")
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

router.get("/getusermocktrades/:userId", async(req, res)=>{
    const {userId} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let todaysTrade = await MockTradeDetails.aggregate([
        [
            {
              $match: {
                trade_time: {
                  $regex: todayDate,
                },
                userId:userId,
              },
            },
            {
              $project: {
                _id : 0,
                createdBy: 1,
                Product: 1,
                buyOrSell: 1,
                Quantity: 1,
                symbol: 1,
                average_price: 1,
                brokerage: 1,
                amount: 1,
                trade_time: 1,
                order_id: 1,
                status: 1,
              },
            },
            {
              $sort:
                {
                  trade_time: -1,
                },
            },
          ]
    ])
        res.status(201).json(todaysTrade);
 
})

router.get("/datewisetraderpnl/:queryDate/:traderName", async(req, res)=>{
    console.log("Inside Aggregate API - Date wise company pnl based on date entered")
    let {queryDate,traderName} = req.params
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log("Today "+todayDate)
    
    let pipeline = [ {$match: {
                        trade_time : {$gte : `${queryDate} 00:00:00`, $lte : `${queryDate} 23:59:59`},
                        status : "COMPLETE",
                        createdBy : traderName
                    }
                        // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                    },
                    { $group :
                            { _id: {
                                "date": {$substr: [ "$trade_time", 0, 10 ]},
                                "traderName": "$createdBy"
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

router.get("/getuserreportdatewisename/:name/:firstDate/:secondDate", async(req, res)=>{
    const {name, firstDate, secondDate} = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$gte : `${firstDate} 00:00:00`, $lte : `${secondDate} 23:59:59`}, createdBy: name, status: "COMPLETE"} },
        
        { $group: { _id: {
                             "date": {$substr: [ "$trade_time", 0, 10 ]},
                                "buyOrSell": "$buyOrSell",
                                "trader" : "$createdBy"
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
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getuserreport/:firstDate/:secondDate", async(req, res)=>{
    const {firstDate, secondDate} = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$gte : `${firstDate} 00:00:00`, $lte : `${secondDate} 23:59:59`}, status: "COMPLETE"} },
        
        { $group: { _id: {
                             "date": {$substr: [ "$trade_time", 0, 10 ]},
                                "trader" : "$createdBy"
                            },
                    amount: {
                        $sum: "$amount"
                    }

                    }},
             { $sort: {_id: -1}},
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getuniquedates/:firstDate/:secondDate", async(req, res)=>{
    const {firstDate, secondDate} = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time: {$gte : `${firstDate} 00:00:00`, $lte : `${secondDate} 23:59:59`}, status: "COMPLETE"} },
        
        { $group: { _id: {
                             "date": {$substr: [ "$trade_time", 0, 10 ]},
                            },

                    }},
             { $sort: {_id: 1}},
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getweeklytraderpnl/:firstWeek/:secondWeek", async(req, res)=>{
    const {firstWeek, secondWeek} = req.params;
    
    let pnlDetails = await MockTradeDetails.aggregate([
        {
          $match:
            {
              status: "COMPLETE",
            },
        },
        {
          $project: {
            weekNumber: {
              $week: {
                $toDate: "$trade_time",
              },
            },
            trader: "$createdBy",
            amount: "$amount",
            lots: "$Quantity",
            date: "$trade_time",
            status: "$status",
          },
        },
        {
          $group: {
            _id: {
              trader: "$trader",
              weekNumber: "$weekNumber",
            },
            gpnl: {
              $sum: {
                $multiply: ["$amount", 1],
              },
            },
          },
        },
        {
          $match: {
            "_id.weekNumber": {
              $gte: Number(firstWeek),
              $lte: Number(secondWeek),
            },
          },
        },
      ])

        res.status(201).json(pnlDetails);
 
})

router.get("/getuniqueweeks/:firstWeek/:secondWeek", async(req, res)=>{
    const {firstWeek, secondWeek} = req.params;
    
    let pnlDetails = await MockTradeDetails.aggregate([
        {
          $project: {
            weekNumber: {
              $week: {
                $toDate: "$trade_time",
              },
            },
            year: {
              $year: {$toDate : "$trade_time"},
            },
          },
        },
        {
          $group: {
            _id: {
              weekNumber: "$weekNumber",
              year: "$year"
            },
          },
        },
        {
          $match: {
            "_id.weekNumber": {
              $gte: Number(firstWeek),
              $lte: Number(secondWeek),
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.weekNumber": 1,
          },
        },
      ])

        res.status(201).json(pnlDetails);
 
})
 
router.get("/traderpnlreport/:startDate/:endDate", async(req, res)=>{
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

router.get("/getoverallpnlmocktradetradertoday", async(req, res)=>{
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

router.get("/gettraderwisepnlmocktradetradertoday", async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await MockTradeDetails.aggregate([
        { $match: { trade_time : {$gte: `${todayDate} 00:00:00` , $lte: `${todayDate} 23:59:59`}, status: "COMPLETE"} },
        
        { $group: { _id: {
                                "traderId": "$userId",
                                "traderName": "$createdBy",
                                "symbol": "$instrumentToken",
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

router.get("/getoverallpnlmocktradeparticularusertodaytraderside/:email", async(req, res)=>{
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
            
        res.status(201).json(pnlDetails);
 
})

router.get("/batchwisepnl", async(req, res)=>{
  let batchwisepnl = await MockTradeDetails.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "userId",
        foreignField: "email",
        as: "zyx",
      },
    },
    {
      $project: {
        designation: {
          $arrayElemAt: ["$zyx.designation", 0],
        },
        dojWeekNumber: {
          $week: {
            $toDate: {
              $arrayElemAt: [
                "$zyx.joining_date",
                0,
              ],
            },
          },
        },
        BatchYear: {
          $year: {
            $toDate: {
              $arrayElemAt: [
                "$zyx.joining_date",
                0,
              ],
            },
          },
        },
        weekNumber: {
          $week: {
            $toDate: "$trade_time",
          },
        },
        Year: {
          $year: {
            $toDate: "$trade_time",
          },
        },
        doj: {
          $arrayElemAt: ["$zyx.joining_date", 0],
        },
        trader: "$createdBy",
        amount: "$amount",
        lots: "$Quantity",
        date: "$trade_time",
        status: "$status",
        userId: "$userId",
        email: {
          $arrayElemAt: ["$zyx.email", 0],
        },
      },
    },
    {
      $match: {
        status: "COMPLETE",
        designation: "Equity Trader",
      },
    },
    {
      $group: {
        _id: {
          BatchWeek: "$dojWeekNumber",
          BatchYear: "$BatchYear",
          WeekNumber: "$weekNumber",
          Year: "$Year",
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        count: {
          $push: "$userId",
        },
      },
    },
    {
      $group: {
        _id: {
          BatchWeek: "$_id.BatchWeek",
          BatchYear: "$_id.BatchYear",
          WeekNumber: "$_id.WeekNumber",
          Year: "$_id.Year",
          gpnl: "$gpnl",
        },
        noOfTraders: {
          $sum: {
            $size: {
              $setUnion: "$count",
            },
          },
        },
      },
    },
    {
      $sort: {
        "_id.Year": 1,
        "_id.WeekNumber": 1,
        "_id.BatchYear": 1,
        "_id.Batch": 1,
      },
    },
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          Batch: {
            $add: [
              {
                $toInt: "$_id.BatchWeek",
              },
              {
                $toInt: "$_id.BatchYear",
              },
            ],
          },
        },
    },
  ])
  res.status(201).json(batchwisepnl);
})

router.get("/gettraderpnlformargin/:email/", async(req, res)=>{
  const {email} = req.params;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
     
  
  let pnlDetails = await MockTradeDetails.aggregate([
    {
      $match:
        {
          trade_time: {
            $lt: `${todayDate} 00:00:00`,
          },
          userId: email,
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

      res.status(201).json(pnlDetails);

})

router.get("/gettraderpnlformarginAll", async(req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
     
  
  let pnlDetails = await MockTradeDetails.aggregate([
    {
      $match:
        {
          trade_time: {
            $lt: `${todayDate} 00:00:00`,
          },
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
    {
      $sort : {npnl : -1}
    }
  ])

      res.status(201).json(pnlDetails);

})

router.get("/gettraderpnlforavailablemargin/:email/", async(req, res)=>{
  const {email} = req.params;  
  
  let pnlDetails = await MockTradeDetails.aggregate([
    {
      $match:
        {
          userId: email,
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

      res.status(201).json(pnlDetails);

})

router.get("/gettraderpnlforusedmargin/:email/", async(req, res)=>{
  const {email} = req.params; 
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` 
  
  let pnlDetails = await MockTradeDetails.aggregate([
    {
      $match:
        {
          trade_time: { $regex: todayDate},
          userId: email,
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

      res.status(201).json(pnlDetails);

})

router.get("/getTraderPNLAndTotalCreditData", async(req, res)=>{

  let pnlDetails = await MockTradeDetails.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "userId",
        foreignField: "email",
        as: "result",
      },
    },
    {
      $match: {
      status : "COMPLETE" 
      }
    },
    {
      $group: {
        _id: {
          userId: "$userId",
          traderName: "$createdBy",
          funds: {
            $arrayElemAt: ["$result.fund", 0],
          },
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
          availableMargin : {
            $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
          }
        },
    },
    {
      $project:
        {
          _id: 0,
          userId: "$_id.userId",
          traderName: "$_id.traderName",
          totalCredit: "$_id.funds",
          gpnl: "$gpnl",
          brokerage: "$brokerage",
          npnl: "$npnl",
          availableMargin: "$availableMargin"
        },
    },
    {
      $sort : {npnl : 1}
    }
  ])
          
              // //console.log(pnlDetails)

      res.status(201).json(pnlDetails);

})


module.exports = router;
