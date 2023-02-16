const express = require("express");
const router = express.Router();
require("../../db/conn");
const Margin = require("../../models/marginAllocation/marginAllocationSchema");


router.post("/setmargin", (req, res)=>{
    const {traderName, amount, lastModifiedBy, uId, userId, createdBy} = req.body;

    if(!traderName || !amount){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    // Margin.findOne({name : name})
    // .then((dateExist)=>{
    //     if(dateExist){
    //         //console.log("data already");
    //         return res.status(422).json({error : "date already exist..."})
    //     }
        const margin = new Margin({amount, lastModifiedBy, uId, userId, createdBy});

        margin.save().then(()=>{
            
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> console.log(err, "in adding fund"));
    
})

router.get("/readApiExchange", (req, res)=>{
    ApiExchange.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

module.exports = router;