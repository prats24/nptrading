const express = require("express");
const router = express.Router();
require("../../db/conn");
const Instrument = require("../../models/Instruments/instrumentSchema");
const ContestInstrument = require("../../models/Instruments/contestInstrument");

const axios = require('axios');
const fetchToken = require("../../marketData/generateSingleToken");
const RequestToken = require("../../models/Trading Account/requestTokenSchema");
const Account = require("../../models/Trading Account/accountSchema");
const {subscribeTokens, unSubscribeTokens} = require('../../marketData/kiteTicker');

router.post("/contestInstrument", async (req, res)=>{

    try{
        let {instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy, createdByUserId, lotSize, contractDate, maxLot, contest} = req.body;
        const {_id, contestName} = contest;
        console.log("Request Body inside instrument auth: ",req.body);
        console.log("Exchange & Symbol: ", exchange,symbol)
        let instrumentToken = await fetchToken(exchange, symbol);
        console.log("instrumentToken", instrumentToken);
        let firstDateSplit = (contractDate).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        contractDate = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]}`

        if(!instrument || !exchange || !symbol || !status || !uId || !createdOn || !lastModified || !createdBy || !createdByUserId || !lotSize || !instrumentToken){
            if(!instrumentToken){
                return res.status(422).json({error : "Please enter a valid Instrument."})
            }
            console.log(instrumentToken);
            console.log(req.body);
            // console.log("data nhi h pura");
            return res.status(422).json({error : "Any of one feild is incorrect..."})
        }
    
        ContestInstrument.findOne({uId : uId})
        .then((dateExist)=>{
            if(dateExist){
                console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }
            const instruments = new ContestInstrument({instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy, createdByUserId, lotSize, instrumentToken, contractDate, maxLot, contest: {name: contestName, contestId: _id}});
            console.log("instruments", instruments)
            instruments.save().then(async()=>{
                 await subscribeTokens();
                res.status(201).json({massage : "data enter succesfully"});
            }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        }).catch(err => {console.log( err,"fail")});

    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        res.status(500).json({error:err});
        return new Error(err);
    }
})

router.get("/contestInstrument", (req, res)=>{
    ContestInstrument.find({status: "Active"}, (err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/contestInstrument/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ContestInstrument.find(
        { "contest.contestId": id, status: "Active" }
      )
        .sort({ date: -1 })
        .exec();
  
      if (data.length === 0) {
        return res.status(404).send("No data found");
      }
  
      return res.status(200).send(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  });

router.get("/readInstrumentDetails", (req, res)=>{
    Instrument.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readInstrumentDetails/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    Instrument.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/contestInstrument/:id", async (req, res)=>{
    //console.log(req.params)
    console.log( req.body)
    let {contest, contract_Date, Exchange, Symbole} = req.body;
    const {_id, contestName} = contest;
    
    if(contract_Date !== undefined){
        let firstDateSplit = (contract_Date).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        contract_Date = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]}`
    }

    try{ 
        const {id} = req.params
        const token = await fetchToken(Exchange, Symbole);
        const instrument = await ContestInstrument.findOneAndUpdate({_id : id}, {
            $set:{ // contest: {name: contestName, contestId: _id}
                instrument: req.body.Instrument,
                exchange: req.body.Exchange,
                symbol: req.body.Symbole,
                status: req.body.Status,
                lastModified: req.body.lastModified,  
                lotSize: req.body.LotSize,
                instrumentToken: token,
                contractDate: req.body.contract_Date, 
                maxLot: req.body.maxLot,
                contest: {name: contestName, contestId: _id}
                
            }
        })
        //console.log("this is role", instrument);
        if(((req.body).Symbole !== instrument.symbol) || (req.body).Status === "Inactive"){
            unSubscribeTokens(instrument.instrumentToken).then(()=>{});
        }
        subscribeTokens().then(()=>{});           

        res.send(instrument)
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data Check access token"});
    }
})

router.delete("/readInstrumentDetails/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const instrumentDetail = await Instrument.findOne({_id : id})
        const instrument = await Instrument.deleteOne({_id : id})
        //console.log("this is userdetail", instrument, instrumentDetail);

        unSubscribeTokens(instrumentDetail.instrumentToken).then(()=>{});
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }
})

module.exports = router;