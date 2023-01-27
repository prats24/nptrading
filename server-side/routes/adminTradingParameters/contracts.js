const express = require("express");
const router = express.Router();
require("../../db/conn");
const Contract = require("../../models/adminTradingParamsSchema/contractSchema");

router.get("/", (req, res)=>{
    res.send("hello from router")
})

router.post("/contractDetails", (req, res)=>{
    const {date, ce, pe, contractDate, ceTicker, peTicker, uId, index} = req.body;

    if(!date || !ce || !pe || !contractDate || !ceTicker || !peTicker || !uId || !index){
        // console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    Contract.findOne({date : date})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const contract = new Contract({date, ce, pe, contractDate, ceTicker, peTicker, uId, index});

        contract.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log( "fail")});
    
})

router.get("/readContractDetails", (req, res)=>{
    Contract.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readContractDetails/:id", (req, res)=>{
    // console.log(req.params)
    const {id} = req.params
    Contract.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

module.exports = router;