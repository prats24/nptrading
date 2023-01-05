const express = require("express");
const router = express.Router();
require("../../db/conn");
const Brokerage = require("../../models/Trading Account/brokerageSchema");

router.post("/brokerage", (req, res)=>{
    const {brokerName, type, brokerageCharge, exchangeCharge, gst, sebiCharge, stampDuty, sst, createdOn, lastModified, createdBy, transaction, exchange, ctt, dpCharge, uId} = req.body;
    console.log(req.body);
    if(!brokerName || !type || !brokerageCharge || !exchangeCharge || !gst || !sebiCharge || !stampDuty || !sst || !createdOn || !lastModified || !createdBy || !transaction || !exchange || !ctt || !dpCharge || !uId){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    Brokerage.findOne({uId : uId})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const brokerage = new Brokerage({brokerName, type, brokerageCharge, exchangeCharge, gst, sebiCharge, stampDuty, sst, createdOn, lastModified, createdBy, transaction, exchange, ctt, dpCharge, uId});

        brokerage.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
    
})

router.get("/readBrokerage", (req, res)=>{
    Brokerage.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readBrokerage/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Brokerage.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readBrokerage/:id", async (req, res)=>{
    console.log(req.params)
    console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const brokerage = await Brokerage.findOneAndUpdate({_id : id}, {
            $set:{
                brokerName: req.body.Broker,
                type: req.body.Type,
                brokerageCharge: req.body.BrokerageCharge,
                exchangeCharge: req.body.ExchangeCharge,
                gst: req.body.GST,
                sebiCharge: req.body.SEBICharge,
                stampDuty: req.body.StampDuty,
                sst: req.body.SST,
                lastModified: req.body.lastModified,
                transaction: req.body.Transaction,
                exchange: req.body.Exchange,
                ctt: req.body.CTT,
                dpCharge: req.body.DPCharges
            }
        })
        console.log("this is role", brokerage);
        res.send(brokerage)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readBrokerage/:id", async (req, res)=>{
    console.log(req.params)
    try{
        const {id} = req.params
        const brokerage = await Brokerage.deleteOne({_id : id})
        console.log("this is userdetail", brokerage);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})



module.exports = router;