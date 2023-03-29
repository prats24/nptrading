const express = require("express");
const router = express.Router();
require("../../db/conn");
const StockIndex = require("../../models/StockIndex/stockIndexSchema");
const axios = require('axios');
const fetchToken = require("../../marketData/generateSingleToken");
const RequestToken = require("../../models/Trading Account/requestTokenSchema");
const {subscribeTokens, unSubscribeTokens, subscribeSingleToken} = require('../../marketData/kiteTicker');
const authentication = require("../../authentication/authentication")
const User = require("../../models/User/userDetailSchema")

router.post("/stockindex",authentication, async (req, res)=>{

    let date = new Date();
    console.log(req.body);

    try{
        let {displayName, exchange, instrumentSymbol, status, createdBy, lastModifiedBy} = req.body;
        let instrumentToken = await fetchToken(exchange, instrumentSymbol);
        console.log("Instrument Token: ",instrumentToken)

        if(!displayName || !exchange || !instrumentSymbol || !status || !instrumentToken || !createdBy || !lastModifiedBy){
            if(!instrumentToken){
                return res.status(422).json({error : "Please enter a valid Instrument."})
            }

            return res.status(422).json({error : "Any of one feild is incorrect..."})
        }
    
        StockIndex.findOne({instrumentToken : instrumentToken})
        .then(async (dataExist)=>{
            if(dataExist){
                console.log("data already");
                res.status(422).json({message : "Index already Added"})
                return;
            }
            const index = new StockIndex({displayName, exchange, instrumentSymbol, status, instrumentToken, createdBy, lastModifiedBy});
            console.log("instruments Symbol", instrumentSymbol)
            index.save().then(async()=>{
                 await subscribeSingleToken(instrumentToken);
                res.status(201).json({message : "Index Added"});
            }).catch((err)=> res.status(500).json({error:err}));
        }).catch(err => {console.log( "Data entry failed")});

    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        res.status(500).json({error:err});
        return new Error(err);
    }
})

router.get("/stockindex", (req, res)=>{
    StockIndex.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})


module.exports = router;