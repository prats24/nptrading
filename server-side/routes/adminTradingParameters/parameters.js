const express = require("express");
const router = express.Router();
require("../../db/conn");
const Perameters = require("../../models/adminTradingParamsSchema/parameterSchema");

router.get("/", (req, res)=>{
    res.send("hello from router")
})

router.post("/parameterDetails", (req, res)=>{
    const {date, uId, quantity, allowedLot, amount} = req.body;

    if (!date || !uId || !quantity || !allowedLot || !amount){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    Perameters.findOne({date : date})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const perams = new Perameters({date, uId, quantity, allowedLot, amount});

        perams.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
    
})

router.get("/readParametersDetails", (req, res)=>{
    Perameters.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readParametersDetails/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Perameters.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

module.exports = router;