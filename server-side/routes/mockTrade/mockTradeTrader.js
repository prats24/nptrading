const express = require("express");
const router = express.Router();
require("../../db/conn");
const MockTradeDetails = require("../../models/mock-trade/mockTradeTraders");


router.get("/getoverallpnlmocktradeparticulartradertoday/:email", async(req, res)=>{
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


router.get("/gettraderreportdatewise/:email/:firstDate/:secondDate", async(req, res)=>{
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

router.get("/gethistorymocktradesparticulartrader/:email", async(req, res)=>{
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

router.get("/gettodaysmocktradesparticulartrader/:email", async(req, res)=>{
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

//overall pnl
router.get("/getoverallpnlmocktradetradertoday/nonalgo", async(req, res)=>{
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
// traderwise index.js
router.get("/gettraderwisepnlmocktradetradertoday/nonalgo", async(req, res)=>{
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

// order
router.get("/getusermocktrades/nonalgo/:userId", async(req, res)=>{
  const {userId} = req.params;
  console.log(userId)
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
              userId: 1
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

// view trade
router.get("/getoverallpnlmocktradeparticularusertodaytraderside/nonalgo/:email", async(req, res)=>{
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

module.exports = router;
