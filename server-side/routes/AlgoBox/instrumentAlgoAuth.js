const express = require("express");
const router = express.Router();
require("../../db/conn");
const InstrumentAlgo = require("../../models/AlgoBox/instrumentMappingSchema");
const fetchToken = require("../../marketData/generateSingleToken");
const Instrument = require("../../models/Instruments/instrumentSchema");


router.post("/instrumentAlgo", async (req, res)=>{

    try{

        

        const {InstrumentNameIncoming, IncomingInstrumentCode, InstrumentNameOutgoing, OutgoingInstrumentCode, Status, lastModified, uId, createdBy, createdOn} = req.body;

        let instrumentDetail = await Instrument.find({status: "Active", instrument: InstrumentNameIncoming});
        let incomingInstrumentToken;
        let outgoingInstrumentToken;
        if(instrumentDetail.length !== 0){
            console.log("instrumentDetail", instrumentDetail)
            incomingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, InstrumentNameIncoming);
            outgoingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, InstrumentNameOutgoing);
        } else{
            instrumentDetail = await Instrument.find({status: "Active"});
            console.log("instrumentDetail in else", instrumentDetail)
            incomingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, InstrumentNameIncoming);
            outgoingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, InstrumentNameOutgoing);

        }

        console.log(outgoingInstrumentToken, incomingInstrumentToken)

        if(!InstrumentNameIncoming || !InstrumentNameOutgoing || !Status || !lastModified || !uId || !createdBy || !createdOn){
            //console.log(req.body);
            //console.log("data nhi h pura");
            return res.status(422).json({error : "plz filled the field..."})
        }
    
        InstrumentAlgo.findOne({uId : uId})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }
            const instrumentAlgo = new InstrumentAlgo({InstrumentNameIncoming, IncomingInstrumentCode: incomingInstrumentToken, InstrumentNameOutgoing, OutgoingInstrumentCode: outgoingInstrumentToken, Status, lastModified, uId, createdBy, createdOn, incomingInstrumentExchange: instrumentDetail[0].exchange, outgoingInstrumentExchange: instrumentDetail[0].exchange});
    
            console.log("instrumentAlgo", instrumentAlgo)
            instrumentAlgo.save().then(()=>{
                res.status(201).json({massage : "data enter succesfully"});
            }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        }).catch(err => {console.log("fail")});

    } catch(err){

        res.status(500).json({error:"Failed to enter data Check access token"});
        return new Error(err);

    }

})

router.get("/readInstrumentAlgo", (req, res)=>{
    InstrumentAlgo.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readInstrumentAlgo/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    InstrumentAlgo.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readInstrumentAlgo/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params

        let instrumentDetail = await Instrument.find({status: "Active", instrument: req.body.incoming_instrument});
        let incomingInstrumentToken;
        let outgoingInstrumentToken;
        if(instrumentDetail.length !== 0){
            console.log("instrumentDetail", instrumentDetail)
            incomingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, req.body.incoming_instrument);
            outgoingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, req.body.outgoing_instrument);
        } else{
            instrumentDetail = await Instrument.find({status: "Active"});
            console.log("instrumentDetail in else", instrumentDetail)
            incomingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, req.body.incoming_instrument);
            outgoingInstrumentToken = await fetchToken(instrumentDetail[0].exchange, req.body.outgoing_instrument);

        }

        const instrumentAlgo = await InstrumentAlgo.findOneAndUpdate({_id : id}, {
            $set:{
                InstrumentNameIncoming: req.body.incoming_instrument,
                IncomingInstrumentCode: incomingInstrumentToken,
                InstrumentNameOutgoing: req.body.outgoing_instrument,
                OutgoingInstrumentCode: outgoingInstrumentToken,
                Status: req.body.Status,
                lastModified: req.body.lastModified,
                lastModifiedBy: req.body.lastModifiedBy,
                incomingInstrumentExchange: instrumentDetail[0].exchange,
                outgoingInstrumentExchange: instrumentDetail[0].exchange
            }
        })
        //console.log("this is role", instrumentAlgo);
        res.send(instrumentAlgo)
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readInstrumentAlgo/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const instrumentAlgo = await InstrumentAlgo.deleteOne({_id : id})
        //console.log("this is userdetail", instrumentAlgo);
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})

module.exports = router;