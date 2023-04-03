const express = require("express");
const router = express.Router();
require("../../db/conn");
const ContestRule = require("../../models/Contest/contestRulesSchema");
const axios = require('axios');
const authentication = require("../../authentication/authentication")
const User = require("../../models/User/userDetailSchema")
// const { v4: uuidv4 } = require('uuid');

router.post("/contestrule",authentication, async (req, res)=>{

    console.log(req.body);
    // const id = req.user;

    try{
        let {ruleName, status} = req.body;
        console.log(req.body)
        const id = req.user._id;

        if(!ruleName || !status){
            return res.status(422).json({error : "Please fill all the fields"})
        }
    
        ContestRule.findOne({ruleName : ruleName})
        .then(async (dataExist)=>{
            if(dataExist){
                console.log("This rule name already exists");
                res.status(422).json({error : "This rule name already exists"})
                return;
            }
            const rule = new ContestRule({ruleName, status, createdBy : id, lastModifiedBy : id});
            console.log("Rule: ",ruleName,status)
            rule.save().then(async(data)=>{
                res.status(201).json({message : "Contest Rule Created", data: rule});
            }).catch((err)=> res.status(500).json({error:err}));
        }).catch(err => {console.log(err)});

    } catch(err) {
        res.status(500).json({error:err});
        return new Error(err);
    }
})

router.get("/contestrule", (req, res)=>{
    ContestRule.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.put("/contestrule/:id",authentication, async (req, res)=>{
    const {id} = req.params;
    console.log("Request Body on Edit",req.body)
    let {orderNo,rule} = req.body.contestRules;
    const modifiedBy = req.user._id;
    const modifiedOn = new Date();
    // console.log(displayName, exchange, instrumentSymbol, status)
    const contestRule = await ContestRule.findOne({_id : id})
    console.log(contestRule)
    
    ContestRule.findOneAndUpdate({_id : id}, 
        {contestRules:[...contestRule.contestRules,{orderNo:orderNo,rule:rule}], lastModifiedBy:modifiedBy, lastModifiedOn:modifiedOn}, 
        // {new: true}
        )
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        console.log(err)
        return res.status(422).json({error : "Data not found"})
    })
})

router.get("/contestrule/:id", (req, res)=>{
    const {id} = req.params;

    ContestRule.find({ _id: id })
    .populate('lastModifiedBy', { first_name: 1, last_name: 1 })
    .then((data) => {
        if (!data) {
            return res.status(404).json({ error: "Data not found" });
        }
        return res.status(200).send(data);
    })
    .catch((err) => {
        return res.status(500).json({ error: err.message });
    })
})


module.exports = router;