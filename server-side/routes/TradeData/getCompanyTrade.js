const express = require("express");
const { restart } = require("nodemon");
const router = express.Router();
require("../../db/conn");
const LiveCompanyTradeData = require("../../models/TradeDetails/liveTradeSchema");


router.get("/companylivetradedatatodaywithemail/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate);
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readlivetradecompanyDate", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    //console.log(todayDate)
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/updatelivetradedata", async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // //console.log(todayDate)
    let datatoupdate = await LiveCompanyTradeData.find()
    //console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            //console.log(datatoupdate[i]);
            await LiveCompanyTradeData.findByIdAndUpdate(datatoupdate[i]._id, {trade_time : datatoupdate[i].order_timestamp},
                function (err, trade_time) {
                    if (err){
                        //console.log(err)
                    }
                    else{
                        //console.log("Trade Time : ", trade_time);
                    }
        }).clone();
        }
})

router.get("/updatelivetradedataamount", async(req, res)=>{
    let datatoupdate = await LiveCompanyTradeData.find()
    //console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            ////console.log(datatoupdate[i]);
            await LiveCompanyTradeData.findByIdAndUpdate(datatoupdate[i]._id, {amount : Number(datatoupdate[i].Quantity) * datatoupdate[i].average_price},
                function (err, trade_time) {
                    if (err){
                        //console.log(err)
                    }
                    else{
                        //console.log("Trade Time : ", trade_time);
                    }
        }).clone();
        }
})

router.get("/readliveTradecompany", (req, res)=>{
    LiveCompanyTradeData.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
         
            return res.status(200).send(data);
        }
    })
})

router.get("/readliveTradecompanycount", (req, res)=>{
    LiveCompanyTradeData.count((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readliveTradecompanycountToday", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

    LiveCompanyTradeData.count({order_timestamp: {$regex: todayDate}},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readliveTradecompany/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    LiveCompanyTradeData.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyemail/:email", (req, res)=>{
    const {email} = req.params
    LiveCompanyTradeData.find({userId: email}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyDate", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    //console.log(todayDate)
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanypariculardate/:date", (req, res)=>{
    const {date} = req.params
    LiveCompanyTradeData.find({order_timestamp: {$regex: date}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanypagination/:skip/:limit", (req, res)=>{
    //console.log(req.params)
    const {limit, skip} = req.params
    LiveCompanyTradeData.find().sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanytodaydatapagination/:skip/:limit", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {limit, skip} = req.params
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanypariculardatewithemail/:date/:email", (req, res)=>{
    const {date, email} = req.params
    LiveCompanyTradeData.find({order_timestamp: {$regex: date}, userId: email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyDate/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate);
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time:-1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyThisMonth", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    let monthStart = `${String(01).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate)
    // LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}})
    LiveCompanyTradeData.find({trade_time: {$gte:monthStart,$lt: todayDate}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyThisWeek/:email", (req, res)=>{
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

    LiveCompanyTradeData.find({trade_time: {$gte:weekStartDate,$lt:nextDate}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })

})

router.get("/readliveTradecompanyThisMonth/:email", (req, res)=>{
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
    LiveCompanyTradeData.find({trade_time: {$gte:monthStart,$lt: nextDay}, userId: {$regex: email}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyThisYear/:email", (req, res)=>{
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
    LiveCompanyTradeData.find({trade_time: {$gte:yearStart,$lt:nextDay}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })

router.get("/readlivetradecompanycount", (req, res)=>{
        LiveCompanyTradeData.count((err, data)=>{
            if(err){
                return res.status(500).send(err);
            }else{
                res.json(data)
            }
        })
    })

})
router.get("/readlivetradecompanycountToday", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

    LiveCompanyTradeData.count({order_timestamp: {$regex: todayDate}},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/getoverallpnllivetradecompanytoday", async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
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
            
                //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/gettraderwisepnllivetradecompanytoday", async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time : {$gte: `${todayDate} 00:00:00` , $lte: `${todayDate} 23:59:59`}, status: "COMPLETE"} },
        
        { $group: { _id: {
                                "traderId": "$userId",
                                "traderName": "$createdBy",
                                // "buyOrSell": "$buyOrSell",
                                // "traderName": "$createdBy",
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


router.get("/getavgpricelivetradecompany", async(req, res)=>{
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
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

    let getAvgPrice = await LiveCompanyTradeData.aggregate(pipeline)
            
                //console.log(getAvgPrice);

        res.status(201).json(getAvgPrice);
        
})

router.get("/getlastestlivetradecompany", async(req, res)=>{
    //console.log("Inside Aggregate API - Latest Live Trade API")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}} },
                    { $project: { "_id" : 0,"trade_time" : 1,  "createdBy" : 1, "buyOrSell" : 1, "Quantity" : 1, "symbol" : 1, "status" : 1  } },
                    { $sort: { "trade_time": -1 }}
                ]

    let x = await LiveCompanyTradeData.aggregate(pipeline)

        res.status(201).json(x[0]);
        
})

router.get("/getpnllivetradecompanylastfivedays", async(req, res)=>{
    //console.log("Inside Aggregate API - Last 5 days chart data live pnl")
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
    let x = await LiveCompanyTradeData.aggregate([
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
            
                //console.log(x);

        res.status(201).json(x);
        
})

router.get("/getpnllivetradecompanydailythismonth", async(req, res)=>{
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
    let x = await LiveCompanyTradeData.aggregate([
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
            
                //console.log(x);

        res.status(201).json(x);
        
})

router.get("/readlivetradecompanyagg",async (req, res)=>{
    let date = new Date();
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')-1}`
//$gte : `${todayDate} 00:00:00`, 
   let x = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time: {$lte : `${yesterdayDate} 00:00:00`} } },
        { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
        { $sort:{ _id: -1 }}
     ])

        res.status(201).json(x);
})
//{ trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} }
router.get("/readlivetradecompanytodayagg",async (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let x = await LiveCompanyTradeData.aggregate([
         { $match: { trade_time: {$gte : `${todayDate} 00:00:00`, $lte : `${todayDate} 23:59:59`} } },
         { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
         { $sort:{ _id: -1 }}
      ])
 
         res.status(201).json(x);
 })


router.get("/getoverallpnllivetradeparticularusertodaycompanyside/:email", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
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

router.get("/getLiveTradeDetailsUser/:email", async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
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


router.get("/getLiveTradeDetailsAllUser", async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate
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

router.get("/getoverallpnllivetradecompanytoday/algowisedata/:id", async(req, res)=>{
    let date = new Date();
    const {id} = req.params;
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            "algoBox._id": id
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

router.get("/gettraderwisepnllivetradecompanytoday/algowisedata/:id", async(req, res)=>{
    let date = new Date();
    const {id} = req.params;
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await LiveCompanyTradeData.aggregate([
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


module.exports = router;