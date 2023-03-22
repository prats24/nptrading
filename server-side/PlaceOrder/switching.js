const express = require("express");
const router = express.Router();
require("../db/conn");
const authoizeTrade = require('../controllers/authoriseTrade');
const SwitchOneUser = require("../PlaceOrder/switchOneUser")
const MockTradeFunc = require("../PlaceOrder/mockTrade")
const allUserSwitch = require("../PlaceOrder/switchAllTrade")


router.post("/swichingTrade", async (req, res)=>{
    

    if(req.body.fromAlgo){
        allUserSwitch.switchAllTrade(req.body, res)
    } else{
        SwitchOneUser.switchAlgoCheck(req.body, res)
    }
    // if(req.body.apiKey && req.body.accessToken){
    //     LiveTradeFunc.liveTrade(req.body, res)
    // } else{
    //     MockTradeFunc.mockTrade(req.body, res)
    // }
    


})

module.exports = router;