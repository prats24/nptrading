const express = require("express");
const router = express.Router();
require("../../db/conn");
const Instrument = require("../../models/Instruments/instrumentSchema");
const axios = require('axios');
const fetchToken = require("../../marketData/generateSingleToken");
const RequestToken = require("../../models/Trading Account/requestTokenSchema");
const Account = require("../../models/Trading Account/accountSchema");
const {subscribeTokens, unSubscribeTokens} = require('../../marketData/kiteTicker');
const authentication = require("../../authentication/authentication")


router.post("/addInstrument",authentication, async (req, res)=>{

          // , createdBy, createdOn, , maxLot, lastModified
    // const {_id}
    
    console.log(req.user)

    try{
        let {instrument, exchange, symbol, status, uId, lotSize, contractDate, maxLot, instrumentToken} = req.body;


        // let instrumentToken = await fetchToken(exchange, symbol);
        // let otm_p1_Token = await fetchToken(exchange, otm_p1);
        // let otm_p2_Token = await fetchToken(exchange, otm_p2);
        // let otm_p3_Token = await fetchToken(exchange, otm_p3);
        //console.log("instrumentToken", instrumentToken);
        let firstDateSplit = (contractDate).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        contractDate = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]}`

        if(!instrument || !exchange || !symbol || !status || !uId || !createdOn || !lastModified || !createdBy || !lotSize || !instrumentToken){
            if(!instrumentToken){
                return res.status(422).json({error : "Please enter a valid Instrument."})
            }
            //console.log(instrumentToken);
            //console.log(req.body);
            //console.log("data nhi h pura");
            return res.status(422).json({error : "Any of one feild is incorrect..."})
        }
    
        Instrument.findOne({uId : uId})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }
            const instruments = new Instrument({instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy, lotSize, instrumentToken, contractDate, maxLot, otm_p1_Token, otm_p2_Token, otm_p3_Token, otm_p1, otm_p2, otm_p3});
            //console.log("instruments", instruments)
            instruments.save().then(async()=>{
                 await subscribeTokens();
                res.status(201).json({massage : "data enter succesfully"});
            }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        }).catch(err => {console.log( "fail")});

    } catch(err) {
        res.status(500).json({error:"Failed to enter data Check access token"});
        return new Error(err);
    }
})


module.exports = router;