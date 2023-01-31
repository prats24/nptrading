const express = require("express");
const router = express.Router();
require("../db/conn");
const TradeDetail = require("../models/TradeDetailSchema");

router.post("/tradeDetail", (req, res)=>{
    const {uId, instrument, veriety, type, orderType, validity, quantity, dayOrOvernight, price, createdOn, createdBy, lastModified} = req.body;
        //console.log(req.body);
    if(!uId || !instrument || !veriety || !type || !orderType || !validity || !quantity || !dayOrOvernight || !price || !createdOn || !createdBy || !lastModified){
        //console.log(req.body);
        //console.log(Boolean(uId));
        //console.log(Boolean(buyOrSell));
        //console.log(Boolean(ceOrPe));
        //console.log(Boolean(lot));
        //console.log(Boolean(index));
        //console.log(Boolean(strikePrice));
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    TradeDetail.findOne({uId : uId})
    .then((IdExist)=>{
        if(IdExist){
            //console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const trade = new TradeDetail({uId, instrument, veriety, type, orderType, validity, quantity, dayOrOvernight, price, createdOn, createdBy, lastModified});

        trade.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log( "fail")});  
})

router.get("/readTradeDetails", (req, res)=>{
    TradeDetail.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

module.exports = router;