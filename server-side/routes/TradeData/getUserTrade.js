const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserTradeData = require("../../models/TradeDetails/liveTradeUserSchema");


router.get("/readliveTradeuser", (req, res)=>{
    UserTradeData.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.get("/readliveTradeuser/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    UserTradeData.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuseremail/:email", (req, res)=>{
    const {email} = req.params
    UserTradeData.find({userId: email}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeusercountTodaybyemail/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

    UserTradeData.count({order_timestamp: {$regex: todayDate}, userId: email},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readliveTradecompanycountbyemail/:email", (req, res)=>{
    const {email} = req.params
    UserTradeData.count({userId: email},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readliveTradeuserpnl/:email/:status", (req, res)=>{
    const {email, status} = req.params
    UserTradeData.find({userId: email, status:status})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserDate/:email", (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate);
    UserTradeData.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeusertodaydatapagination/:email/:skip/:limit", (req, res)=>{
    const {email, skip, limit} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate);
    UserTradeData.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time: -1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserDate", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    UserTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeusertodaydatapagination/:skip/:limit", (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {skip, limit} = req.params
    UserTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserpagination/:email/:skip/:limit", (req, res)=>{
    const {email, skip, limit} = req.params
    UserTradeData.find({userId: email}).sort({trade_time: -1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserpagination/:skip/:limit", (req, res)=>{
    const {skip, limit} = req.params
    UserTradeData.find().sort({trade_time: -1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserpariculardatewithemail/:date/:email", (req, res)=>{
    const {date, email} = req.params
    UserTradeData.find({order_timestamp: {$regex: date}, userId: email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserpariculardate/:date", (req, res)=>{
    const {date} = req.params
    UserTradeData.find({order_timestamp: {$regex: date}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserThisWeek/:email", (req, res)=>{
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

    UserTradeData.find({trade_time: {$gte:weekStartDate,$lt:nextDate}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })

})

router.get("/readliveTradeuserThisMonth/:email", (req, res)=>{
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
    UserTradeData.find({trade_time: {$gte:monthStart,$lt: nextDay}, userId: {$regex: email}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradeuserThisYear/:email", (req, res)=>{
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
    UserTradeData.find({trade_time: {$gte:yearStart,$lt:nextDay}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readlivetradeuseragg",async (req, res)=>{
    let date = new Date();
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')-1}`
//$gte : `${todayDate} 00:00:00`, 
   let x = await UserTradeData.aggregate([
        { $match: { trade_time: {$lte : `${yesterdayDate} 00:00:00`} } },
        { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "placed_by": 1 } },
        { $sort:{ _id: -1 }}
     ])
                ////console.log(x)

        res.status(201).json(x);
})
//{ trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} }
router.get("/readlivetradeusertodayagg",async (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let x = await UserTradeData.aggregate([
         { $match: { trade_time: {$gte : `${todayDate} 00:00:00`, $lte : `${todayDate} 23:59:59`} } },
         { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "placed_by": 1 } },
         { $sort:{ _id: -1 }}
      ])
                 ////console.log(x)
 
         res.status(201).json(x);
 })

router.get("/getusertrades/:userId", async(req, res)=>{
    const {userId} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let todaysTrade = await UserTradeData.aggregate([
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

module.exports = router;