const express = require("express");
const router = express.Router();
require("../../db/conn");
const Instrument = require("../../models/Instruments/instrumentSchema");
const axios = require('axios');
const fetchToken = require("../../marketData/generateSingleToken");
const RequestToken = require("../../models/Trading Account/requestTokenSchema");
const Account = require("../../models/Trading Account/accountSchema");
const {subscribeTokens, unSubscribeTokens, subscribeSingleToken, unSubscribeSingleToken} = require('../../marketData/kiteTicker');
const authentication = require("../../authentication/authentication")
const User = require("../../models/User/userDetailSchema")
const client = require("../../marketData/redisClient");
const ObjectId = require('mongodb').ObjectId;

router.post("/addInstrument",authentication, async (req, res)=>{

    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let lastModified = createdOn;
      
    const {_id, name} = req.user;

    try{
        let {instrument, exchange, symbol, status, uId, lotSize, contractDate, maxLot, instrumentToken} = req.body;

        let secondDateSplit = contractDate.split("-");
        contractDate = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]}`

        console.log(contractDate)
        if(!instrument || !exchange || !symbol || !status || !uId || !createdOn || !lastModified || !lotSize || !instrumentToken){
            if(!instrumentToken){
                return res.status(422).json({error : "Please enter a valid Instrument."})
            }

            return res.status(422).json({error : "Any of one feild is incorrect..."})
        }
    
        Instrument.findOne({instrumentToken : instrumentToken, status: "Active"})
        .then(async (dataExist)=>{
            if(dataExist){
                //console.log("data already");
                // return res.status(422).json({error : "date already exist..."})
                let getInstruments = await User.findOne({_id : _id});
                getInstruments.watchlistInstruments.push(dataExist._id)
                const updateInstrument = await User.findOneAndUpdate({_id : _id}, {
                    $set:{ 
                        
                        watchlistInstruments: getInstruments.watchlistInstruments
                    }
                    
                })
                try{
                    console.log((_id).toString(), instrumentToken)
                    const redisClient = await client.LPUSH((_id).toString(), (instrumentToken).toString());
                    console.log("this is redis client", redisClient)
    
                } catch(err){
                    console.log(err)
                }
                res.status(422).json({message : "Instrument Added"})
                return;
            }
            const addingInstruments = new Instrument({instrument, exchange, symbol, status, uId, createdOn, lastModified, createdBy: name, createdByUserId: _id, lotSize, instrumentToken, contractDate, maxLot, user_id: _id});
            //console.log("instruments", instruments)
            addingInstruments.save().then(async()=>{

                try{
                    console.log((_id).toString(), instrumentToken)
                 const redisClient = await client.LPUSH((_id).toString(), (instrumentToken).toString());
                 console.log("this is redis client", redisClient)

                } catch(err){
                    console.log(err)
                }
                 await subscribeSingleToken(instrumentToken);
                 let getInstruments = await User.findOne({_id : _id});
                 getInstruments.watchlistInstruments.push(addingInstruments._id)
                 const updateInstrument = await User.findOneAndUpdate({_id : _id}, {
                     $set:{ 
                         
                         watchlistInstruments: getInstruments.watchlistInstruments
                     }
                     
                 })
                res.status(201).json({message : "Instrument Added"});
            }).catch((err)=> res.status(500).json({err: err, error:"Failed to enter data"}));
        }).catch(err => {console.log( "fail")});

    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        res.status(500).json({error:err});
        return new Error(err);
    }
})

router.post("/subscribeInstrument",authentication, async (req, res)=>{

    const {instrumentToken} = req.body;

    try{
        await subscribeSingleToken(instrumentToken);
        console.log("subscribed", instrumentToken)
        res.status(200).json({message: "subscribed"});
    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        // res.status(500).json({error:err});
        return new Error(err);
    }
})

router.post("/unsubscribeInstrument",authentication, async (req, res)=>{

    const {instrumentToken} = req.body;

    try{
        await unSubscribeTokens(instrumentToken);
        console.log("unsubscribed", instrumentToken)
        res.status(200).json({message: "unSubscribed"});
    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        // res.status(500).json({error:err});
        return new Error(err);
    }
})

router.patch("/inactiveInstrument/:instrumentToken", authentication, async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {instrumentToken} = req.params
        const {isAddedWatchlist} = req.body;
        const {_id} = req.user;
        console.log("in removing", instrumentToken, _id);
        const user = await User.findOne({_id: _id});
        const removeFromWatchlist = await Instrument.findOne({instrumentToken : instrumentToken})
        let index = user.watchlistInstruments.indexOf(removeFromWatchlist._id); // find the index of 3 in the array
        if (index !== -1) {
            user.watchlistInstruments.splice(index, 1); // remove the element at the index
            try{
             const redisClient = await client.LREM((_id).toString(), 1, (instrumentToken).toString());

            } catch(err){
                console.log(err)
            }
            // client.LREM(_id, 1, instrumentToken);
        }

        const removing = await User.findOneAndUpdate({_id: _id}, {
            $set:{ 
                
                watchlistInstruments: user.watchlistInstruments
            }
            
        })
        // console.log("removing", removing);
        // res.send(inactiveInstrument)
        res.status(201).json({message : "data patch succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.get("/instrumentDetails", authentication, async (req, res)=>{
    const {_id} = req.user
    // Instrument.find({user_id: _id, status: "Active"}, (err, data)=>{
    //     if(err){
    //         return res.status(500).send(err);
    //     }else{
    //         return res.status(200).send(data);
    //     }
    // }).sort({$natural:-1})
    const user = await User.findOne({_id: _id});

    Instrument.find({ _id: { $in: user.watchlistInstruments }, status: "Active" }, (err, instruments) => {
        if (err) {
          console.log(err);
        } else {
        //   console.log(instruments);
          return res.status(200).send(instruments);
        }
    }).sort({$natural:-1});
})

router.get("/getInstrument/:_id", async (req, res)=>{

    const {_id} = req.params;
    const user = await User.aggregate([
        { $match: { _id: _id } },
        {
          $lookup: {
            from: "instrument-details",
            localField: "watchlistInstruments",
            foreignField: "_id",
            as: "watchlistInstruments"
          }
        },
        { $unwind: "$watchlistInstruments" },
        { $match: { "watchlistInstruments.status": "Active" } },
        { $sort: { _id: -1 } }
      ]);
      
      return res.status(200).send(user);
})


module.exports = router;

