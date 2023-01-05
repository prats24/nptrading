const express = require("express");
const router = express.Router();
require("../../db/conn");
const Account = require("../../models/Trading Account/accountSchema");
const {disconnectTicker, createNewTicker}  = require('../../marketData/kiteTicker');
const getKiteCred = require('../../marketData/getKiteCred');

router.post("/account", (req, res)=>{
    const {brokerName, accountId, accountName, apiKey, apiSecret, status, uId, createdOn, lastModified, createdBy} = req.body;

    if(!brokerName || !accountId || !accountName || !apiKey || !apiSecret || !status || !uId || !createdOn || !lastModified || !createdBy){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    Account.findOne({accountId : accountId})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const account = new Account({brokerName, accountId, accountName, apiKey, apiSecret, status, uId, createdOn, lastModified, createdBy});

        account.save().then(()=>{

            disconnectTicker();
            getKiteCred.getAccess().then((data) => {
                console.log(data);
                createNewTicker(data.getApiKey, data.getAccessToken);
            });  

            
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
    
})

router.get("/readAccountDetails", (req, res)=>{
    Account.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readAccountDetails/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Account.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readAccountDetails/:id", async (req, res)=>{
    console.log(req.params)
    console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const account = await Account.findOneAndUpdate({_id : id}, {
            $set:{
                brokerName: req.body.Broker,
                accountId: req.body.AccountID,
                accountName: req.body.AccountName,
                apiKey: req.body.APIKey,
                apiSecret: req.body.APISecret,
                status: req.body.Status,
                lastModified: req.body.lastModified
            }
        });
        
        disconnectTicker();
        getKiteCred.getAccess().then((data) => {
            console.log(data);
            createNewTicker(data.getApiKey, data.getAccessToken);
        });      

        console.log("this is role", account);
        res.send(account)
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readAccountDetails/:id", async (req, res)=>{
    console.log(req.params)
    try{
        const {id} = req.params
        const account = await Account.deleteOne({_id : id})
        console.log("this is userdetail", account);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }
})

router.patch("/readAccountDetails/:id", async (req, res)=>{
    console.log(req.params)
    console.log("this is body", req.body);
    try{ // Broker, AccountID, AccountName, APIKey, APISecret, Status, lastModified
        const {id} = req.params
        const account = await Account.findOneAndUpdate({_id : id}, {
            $set:{
                status: req.body.Status,
                lastModified: req.body.lastModified
            }
        })
        console.log("this is role", account);
        res.send(account)
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

module.exports = router;