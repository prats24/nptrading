const express = require("express");
const router = express.Router();
require("../../db/conn");
const InstrumentAlgo = require("../../models/AlgoBox/instrumentMappingSchema");
const fetchToken = require("../../marketData/generateSingleToken");
const RetreiveOrderTrade = require("../../models/TradeDetails/retreiveOrder");
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

router.get("/filldatainDB/:date/:symbol", async (req, res)=>{

    const {date, symbol} = req.params;
    // console.log("in missed order id")
    const missedOrderId = await RetreiveOrderTrade.aggregate([
        {
          $match: {
            order_timestamp: { $regex: date },
            // quantity: realQuantity,
            // tradingsymbol: realSymbol,
            status: "COMPLETE",
            tradingsymbol: symbol
            // $or: [
            //     {tradingsymbol: "NIFTY2321618200PE"},
            //     {tradingsymbol: "NIFTY2321617950CE"}
            // ]

          }
        },
        {
          $lookup: {
            from: "live-trade-companies",
            localField: "order_id",
            foreignField: "order_id",
            as: "completed_trade"
          }
        },
        {
          $match: {
            completed_trade: {
              $size: 0
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            order_id: {$first: "$order_id"},
            status: {$first: "$status"},    
            average_price: {$first: "$average_price"},
            quantity: {$first: "$quantity"} ,
            product: {$first: "$product"},
            transaction_type: {$first: "$transaction_type"},
            exchange_order_id: {$first: "$exchange_order_id"},
            order_timestamp: {$first: "$order_timestamp"},
            variety: {$first: "$variety"},
            validity: {$first: "$validity"},
            exchange: {$first: "$exchange"},
            exchange_timestamp: {$first: "$exchange_timestamp"},
            order_type: {$first: "$order_type"},
            price: {$first: "$price"},
            filled_quantity: {$first: "$filled_quantity"},
            pending_quantity: {$first: "$pending_quantity"},
            cancelled_quantity: {$first: "$cancelled_quantity"},
            guid: {$first: "$guid"},
            market_protection: {$first: "$market_protection"},
            disclosed_quantity: {$first: "$disclosed_quantity"},
            tradingsymbol: {$first: "$tradingsymbol"},
            placed_by: {$first: "$placed_by"},
            status_message: {$first: "$status_message"},
            status_message_raw: {$first: "$status_message_raw"},

          }
        }
      ]);
      
    //   const count = uniqueDocumentsCount[0].count;

      console.log(missedOrderId)
})



module.exports = router;