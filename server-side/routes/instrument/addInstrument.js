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

    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let lastModified = createdOn;
      
    const {_id, name} = req.user;
    
    // console.log(req.user, req.body)

    try{
        let {instrument, exchange, symbol, status, uId, lotSize, contractDate, maxLot, instrumentToken} = req.body;


        // let instrumentToken = await fetchToken(exchange, symbol);
        // let otm_p1_Token = await fetchToken(exchange, otm_p1);
        // let otm_p2_Token = await fetchToken(exchange, otm_p2);
        // let otm_p3_Token = await fetchToken(exchange, otm_p3);
        //console.log("instrumentToken", instrumentToken);
        // let firstDateSplit = (contractDate).split(" ");
        let secondDateSplit = contractDate.split("-");
        contractDate = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]}`

        console.log(contractDate)
        if(!instrument || !exchange || !symbol || !status || !uId || !createdOn || !lastModified || !lotSize || !instrumentToken){
            if(!instrumentToken){
                return res.status(422).json({error : "Please enter a valid Instrument."})
            }
            //console.log(instrumentToken);
            //console.log(req.body);
            //console.log("data nhi h pura");
            return res.status(422).json({error : "Any of one feild is incorrect..."})
        }
    
        Instrument.findOne({_id : _id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }
            const instruments = new Instrument({instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy: name, lotSize, instrumentToken, contractDate, maxLot, user_id: _id});
            //console.log("instruments", instruments)
            instruments.save().then(async()=>{
                 await subscribeTokens();
                res.status(201).json({message : "data enter succesfully"});
            }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        }).catch(err => {console.log( "fail")});

    } catch(err) {
        res.status(500).json({error:"Failed to enter data Check access token"});
        return new Error(err);
    }
})

router.patch("/inactiveInstrument/:instrumentToken", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {instrumentToken} = req.params
        const {isAddedWatchlist} = req.body;
        //console.log(realTrade);
        const inactiveInstrument = await Instrument.findOneAndUpdate({instrumentToken : instrumentToken}, {
            $set:{ 
                
                isAddedWatchlist: isAddedWatchlist
            }
            
        })
        //console.log("this is role", tradingAlgo);
        res.send(inactiveInstrument)
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.get("/readInstrumentDetails", authentication, (req, res)=>{
    const {_id} = req.user
    Instrument.find({user_id: _id, status: "Active"}, (err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/getInstrument/:_id", (req, res)=>{
    const {_id} = req.params
    Instrument.find({user_id: _id, isAddedWatchlist: true}, (err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})


module.exports = router;