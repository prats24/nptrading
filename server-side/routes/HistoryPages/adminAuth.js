const express = require("express");
const router = express.Router();
require("../../db/conn");
// const Admin = require("../models/adminSchema");
const RetreiveOrder = require("../../models/TradeDetails/retreiveOrder");

router.get("/missedOrderId", async (req, res)=>{

    // console.log("in missed order id")
    const missedOrderId = await RetreiveOrder.aggregate([
        {
          $match: {
            order_timestamp: { $gte: "2023-02-14" },
            // quantity: realQuantity,
            // tradingsymbol: realSymbol,
            status: "COMPLETE",
            $or: [
                {tradingsymbol: "NIFTY2321617950PE"},
                {tradingsymbol: "NIFTY2321617750CE"}
            ]

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

      // console.log(missedOrderId)
})

module.exports = router;