const express = require("express");
const router = express.Router();
require("../../db/conn");
const RequestToken = require("../../models/Trading Account/requestTokenSchema");
const {disconnectTicker, createNewTicker}  = require('../../marketData/kiteTicker');
const getKiteCred = require('../../marketData/getKiteCred');
const puppeteer = require("puppeteer");
const KiteConnect = require('kiteconnect').KiteConnect;
// const totp = require("totp-generator");
const zerodhaLogin = require("../../utils/zerodhaAutoLogin");


router.post("/requestToken", (req, res)=>{
    const {accountId, accessToken, requestToken, status, generatedOn, lastModified, createdBy, uId} = req.body;

    if(!accountId || !accessToken || !requestToken || !status || !generatedOn || !lastModified || !createdBy || !uId){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    RequestToken.findOne({uId : uId})
    .then((accountIdExist)=>{
        if(accountIdExist){
            //console.log("accountId already");
            return res.status(422).json({error : "account Id already exist..."})
        }
        const requestTokens = new RequestToken({accountId, accessToken, requestToken, status, generatedOn, lastModified, createdBy, uId});

        requestTokens.save().then(()=>{

            disconnectTicker();
            getKiteCred.getAccess().then((data) => {
                //console.log(data);
                createNewTicker(data.getApiKey, data.getAccessToken);
            });
            
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log("fail in accesstoken auth")});
    
})

router.post("/autologin", (req, res)=>{
    const {accountId, apiKey, apiSecret, status, generatedOn, lastModified, createdBy, uId} = req.body;

    if(!accountId || !apiKey || !apiSecret || !status || !generatedOn || !lastModified || !createdBy || !uId){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "Please Fill all Fields."})
    }

    

// Keys provided must be base32 strings, ie. only containing characters matching (A-Z, 2-7, =).
// const token = totp(process.env.KUSH_ACCOUNT_HASH_CODE);
// console.log("otp", token)
let password = accountId === process.env.KUSH_ACCOUNT_ID && process.env.KUSH_PASS

try{

    const login = zerodhaLogin(
        apiKey,
        apiSecret,
        accountId,
        password,
        // `${token}`,
        req.body,
        res
        )

} catch(err){
    return new Error(err);
}


  // console.log("these is tokens: ", login)

    
})

router.get("/readRequestToken", (req, res)=>{
    RequestToken.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readRequestToken/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    RequestToken.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readRequestToken/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{
        const {id} = req.params
        const requestToken = await RequestToken.findOneAndUpdate({_id : id}, {
            $set:{
                accountId: req.body.AccountID,
                accessToken: req.body.AccesToken,
                requestToken: req.body.RequestToken,
                status: req.body.Status,
                lastModified: req.body.lastModified
            }
        });
        disconnectTicker();
        getKiteCred.getAccess().then((data) => {
            //console.log(data);
            createNewTicker(data.getApiKey, data.getAccessToken);
        });
        
        //console.log("this is role", requestToken);
        res.send(requestToken)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readRequestToken/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const requestToken = await RequestToken.deleteOne({_id : id})
        //console.log("this is userdetail", requestToken);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})

router.patch("/inactiveRequestToken/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ // Broker, AccountID, AccountName, APIKey, APISecret, Status, lastModified
        const {id} = req.params
        const account = await RequestToken.findOneAndUpdate({_id : id}, {
            $set:{
                status: req.body.status,
                lastModified: req.body.lastModified
            }
        })
        //console.log("this is role", account);
        res.send(account)
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})


module.exports = router;



