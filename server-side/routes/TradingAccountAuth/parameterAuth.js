const express = require("express");
const router = express.Router();
require("../../db/conn");
const Parameter = require("../../models/Trading Account/parameterSchema")

router.post("/parameter", (req, res)=>{
    const {createdOn, variety, exchange, orderType, validity, status, lastModified, createdBy } = req.body;

    if(!createdOn || !variety || !exchange || !orderType || !validity || !status || !lastModified || !createdBy){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    Parameter.findOne({createdOn : createdOn})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const parameter = new Parameter({createdOn, variety, exchange, orderType, validity, status, lastModified, createdBy});

        parameter.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
    
})

router.get("/readParameter", (req, res)=>{
    Parameter.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readParameter/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Parameter.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

module.exports = router;