const express = require("express");
const router = express.Router();
require("../../db/conn");
const Instrument = require("../../models/Instruments/instrumentSchema");
const axios = require('axios');
const fetchToken = require("../../marketData/generateSingleToken");
const RequestToken = require("../../models/Trading Account/requestTokenSchema");
const Account = require("../../models/Trading Account/accountSchema");
const {subscribeTokens, unSubscribeTokens} = require('../../marketData/kiteTicker');

router.post("/instrument", async (req, res)=>{

    try{
        let {instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy, lotSize, contractDate, maxLot, otm_p1, otm_p2, otm_p3} = req.body;
        //console.log(req.body);

        let instrumentToken = await fetchToken(exchange, symbol);
        let otm_p1_Token = await fetchToken(exchange, otm_p1);
        let otm_p2_Token = await fetchToken(exchange, otm_p2);
        let otm_p3_Token = await fetchToken(exchange, otm_p3);
        //console.log("instrumentToken", instrumentToken);
        let firstDateSplit = (contractDate).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        contractDate = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]}`

        if(!instrument || !exchange || !symbol || !status || !uId || !createdOn || !lastModified || !createdBy || !lotSize || !instrumentToken){
            if(!instrumentToken && !otm_p1_Token && !otm_p2_Token && !otm_p3_Token){
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

router.put("/readInstrumentDetails/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log( req.body)
    let {Exchange, Symbole, contract_Date, otm_p1, otm_p2, otm_p3} = req.body;
    
    if(contract_Date !== undefined){
        let firstDateSplit = (contract_Date).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        contract_Date = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]}`
    }

    try{ 
        const {id} = req.params
        const token = await fetchToken(Exchange, Symbole);
        const otmP1Token = await fetchToken(Exchange, otm_p1);
        const otmP2Token = await fetchToken(Exchange, otm_p2);
        const otmP3Token = await fetchToken(Exchange, otm_p3);
        //console.log(token)
        const instrument = await Instrument.findOneAndUpdate({_id : id}, {
            $set:{ 
                instrument: req.body.Instrument,
                exchange: req.body.Exchange,
                symbol: req.body.Symbole,
                status: req.body.Status,
                lastModified: req.body.lastModified,  
                lotSize: req.body.LotSize,
                instrumentToken: token,
                contractDate: req.body.contract_Date, 
                maxLot: req.body.maxLot,
                otm_p1 : req.body.otm_p1,
                otm_p2 : req.body.otm_p2,
                otm_p3 : req.body.otm_p3,
                otm_p1_Token: otmP1Token,
                otm_p2_Token: otmP2Token,
                otm_p3_Token: otmP3Token,
            }
        })
        //console.log("this is role", instrument);
        if(((req.body).Symbole !== instrument.symbol) || (req.body).Status === "Inactive"){
            unSubscribeTokens(instrument.instrumentToken).then(()=>{});
        }
        subscribeTokens().then(()=>{});           

        res.send(instrument)
    } catch (e){
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