const express = require("express");
const router = express.Router();
require("../../db/conn");
const Admin = require("../models/adminSchema");

router.get("/", (req, res)=>{
    res.send("hello from router")
})

router.post("/admin", (req, res)=>{
    const {date, ce, pe, contractDate, ceTicker, peTicker, enableTrade, quantity, uId, index, allowedLot, amount} = req.body;

    if(!date || !ce || !pe || !contractDate || !ceTicker || !peTicker || !enableTrade || !quantity || !uId || !index || !amount || !allowedLot){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    Admin.findOne({date : date})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const admin = new Admin({date, ce, pe, contractDate, ceTicker, peTicker, enableTrade, quantity, uId, index, allowedLot, amount});

        admin.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
    
})

router.get("/readAdminDetails", (req, res)=>{
    Admin.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

module.exports = router;