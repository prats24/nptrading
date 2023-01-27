const express = require("express");
const router = express.Router();
require("../../db/conn");
const ExchangeMapping = require("../../models/AlgoBox/ExchangeMappingSchema");

router.post("/exchangeMapping", (req, res)=>{
    const {ExchangeNameIncoming, IncomingExchangeCode, ExchangeNameOutgoing, OutgoingInstrumentCode, Status, lastModified, uId, createdBy, createdOn} = req.body;

    if(!ExchangeNameIncoming || !IncomingExchangeCode || !ExchangeNameOutgoing || !OutgoingInstrumentCode || !Status || !lastModified || !uId || !createdBy || !createdOn){
        //console.log(req.body);
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    ExchangeMapping.findOne({uId : uId})
    .then((dateExist)=>{
        if(dateExist){
            //console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const exchangeMapping = new ExchangeMapping({ExchangeNameIncoming, IncomingExchangeCode, ExchangeNameOutgoing, OutgoingInstrumentCode, Status, lastModified, uId, createdBy, createdOn});
        //console.log("this is exchange mapping", typeof(exchangeMapping) , exchangeMapping);
        exchangeMapping.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log( "fail")});
})

router.get("/readExchangeMapping", (req, res)=>{
    ExchangeMapping.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readExchangeMapping/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    ExchangeMapping.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readExchangeMapping/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
       const {id} = req.params
        const exchangeMapping = await ExchangeMapping.findOneAndUpdate({_id : id}, {
            $set:{
                ExchangeNameIncoming: req.body.ExchangeNameIncoming,
                IncomingExchangeCode: req.body.IncomingExchangeCode,
                ExchangeNameOutgoing: req.body.ExchangeNameOutgoing,
                OutgoingInstrumentCode: req.body.OutgoingInstrumentCode,
                Status: req.body.Status,
                lastModified: req.body.lastModified
            }
        })
        //console.log("this is role", exchangeMapping);
        res.send(exchangeMapping)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readExchangeMapping/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const exchangeMapping = await ExchangeMapping.deleteOne({_id : id})
        //console.log("this is userdetail", exchangeMapping);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})

module.exports = router;