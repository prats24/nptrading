const express = require("express");
const router = express.Router();
require("../db/conn");
const ApiValidity = require("../models/apiValiditySchema");

router.get("/", (req, res)=>{
    res.send("hello from router")
})

router.post("/apiValidity", (req, res)=>{
    const {name, active, modifiedOn, createdOn} = req.body;

    if(!name || !active || !modifiedOn || !createdOn){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    ApiValidity.findOne({name : name})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const apiValidity = new ApiValidity({name, active, modifiedOn, createdOn});

        apiValidity.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
})

router.get("/readApiValidity", (req, res)=>{
    ApiValidity.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

module.exports = router;