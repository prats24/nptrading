const express = require("express");
const router = express.Router();
require("../../db/conn");
const InstrumentAlgo = require("../../models/AlgoBox/instrumentMappingSchema");
const fetchToken = require("../../marketData/generateSingleToken");
const RetreiveTrade = require("../../models/TradeDetails/retireivingTrade");
const {subscribeTokens, unSubscribeTokens} = require('../../marketData/kiteTicker');
const axios  = require("axios")
const RetreiveOrder = require("../../controllers/retreiveOrder")
const DupDelRetreiveOrder = require("../../controllers/deleteDuplicateInRetreive")

router.get("/retreiveOrder", async (req, res)=>{

    await RetreiveOrder.retreiveOrder()
 
})

router.get("/deleteDuplicate/retreiveorder", async (req, res)=>{
    // console.log("in deleteDuplicate")
    await DupDelRetreiveOrder.deleteDuplicateData("2023-02-14")
 
})



module.exports = router;