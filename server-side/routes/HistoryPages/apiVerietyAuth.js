const express = require("express");
const router = express.Router();
require("../db/conn");
const ApiVeriety = require("../models/apiVerietySchema");

router.get("/", (req, res)=>{
    res.send("hello from router")
})

router.post("/apiVeriety", (req, res)=>{
    const {name, active, modifiedOn, createdOn} = req.body;

    if(!name || !active || !modifiedOn || !createdOn){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    ApiVeriety.findOne({name : name})
    .then((nameExist)=>{
        if(nameExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const apiVeriety = new ApiVeriety({name, active, modifiedOn, createdOn});

        apiVeriety.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
    
})

router.get("/readApiVeriety", (req, res)=>{
    ApiVeriety.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

module.exports = router;