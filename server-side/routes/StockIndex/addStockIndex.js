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
    // console.log(req.body);
    // const id = req.user;

    try{
        let {displayName, exchange, instrumentSymbol, status} = req.body;
        let instrumentToken = await fetchToken(exchange, instrumentSymbol);
        console.log("Instrument Token: ",instrumentToken)

        if(!displayName || !exchange || !instrumentSymbol || !status || !instrumentToken){
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
            const index = new StockIndex({displayName, exchange, instrumentSymbol, status, instrumentToken, createdBy : id, lastModifiedBy : id});
            // console.log("instruments Symbol", instrumentSymbol)
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

router.put("/stockindex/:id", (req, res)=>{
    const {id} = req.params;
    let {displayName, exchange, instrumentSymbol, status} = req.body;
    const modifiedBy = req.user;
    const modifiedOn = new Date();
    // console.log(displayName, exchange, instrumentSymbol, status)

    StockIndex.findOneAndUpdate({_id : id}, 
        {displayName:displayName, exchange:exchange, instrumentSymbol:instrumentSymbol,status:status, lastModifiedBy:modifiedBy, lastModifiedOn:modifiedOn}, 
        {new: true})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "data not found"})
    })
})

router.get("/stockindex/:id", (req, res)=>{
    const {id} = req.params;

    StockIndex.find({ _id: id })
    .populate('lastModifiedBy', { first_name: 1, last_name: 1 })
    .then((data) => {
        if (!data) {
            return res.status(404).json({ error: "data not found" });
        }
        return res.status(200).send(data);
    })
    .catch((err) => {
        return res.status(500).json({ error: err.message });
    })
})


module.exports = router;