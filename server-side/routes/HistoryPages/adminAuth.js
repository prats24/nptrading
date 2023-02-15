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

      console.log(missedOrderId)
})

module.exports = router;


// [
//   {
//     _id: new ObjectId("63eb678c6ae3372d975ccf1b"),
//     order_id: '230214400909357',
//     status: 'COMPLETE',
//     average_price: 133.2,
//     quantity: 450,
//     product: 'NRML',
//     transaction_type: 'BUY',
//     exchange_order_id: '1000000024461956',
//     order_timestamp: '2023-02-14 10:38:35',
//     variety: 'regular',
//     validity: 'DAY',
//     exchange: 'NFO',
//     exchange_timestamp: '2023-02-14 10:38:35',
//     order_type: 'MARKET',
//     price: 0,
//     filled_quantity: 450,
//     pending_quantity: 0,
//     cancelled_quantity: 0,
//     guid: '57936XCNoWw31zFYCO',
//     market_protection: 0,
//     disclosed_quantity: 0,
//     tradingsymbol: 'NIFTY2321617750CE',
//     placed_by: 'NR0563',
//     status_message: 'null',
//     status_message_raw: 'null'
//   },
//   {11286786
//     _id: new ObjectId("63eb678c6ae3372d975ccf1e"),
//     order_id: '230214400923052',
//     status: 'COMPLETE',
//     average_price: 134.97777778,
//     quantity: 450,
//     product: 'NRML',
//     transaction_type: 'SELL',
//     exchange_order_id: '1000000024844273',
//     order_timestamp: '2023-02-14 10:41:37',
//     variety: 'regular',
//     validity: 'DAY',
//     exchange: 'NFO',
//     exchange_timestamp: '2023-02-14 10:41:37',
//     order_type: 'MARKET',
//     price: 0,
//     filled_quantity: 450,
//     pending_quantity: 0,
//     cancelled_quantity: 0,
//     guid: '01XKADVDafYJRqN',
//     market_protection: 0,
//     disclosed_quantity: 0,
//     tradingsymbol: 'NIFTY2321617750CE',
//     placed_by: 'NR0563',
//     status_message: 'null',
//     status_message_raw: 'null'
//   },
//   {
//     _id: new ObjectId("63eb678d6ae3372d975ccfb1"),
//     order_id: '230214401457515',
//     status: 'COMPLETE',
//     average_price: 179.540625,
//     quantity: 800,
//     product: 'NRML',
//     transaction_type: 'SELL',
//     exchange_order_id: '1000000045560433',
//     order_timestamp: '2023-02-14 12:23:33',
//     variety: 'regular',
//     validity: 'DAY',
//     exchange: 'NFO',
//     exchange_timestamp: '2023-02-14 12:23:33',
//     order_type: 'MARKET',
//     price: 0,
//     filled_quantity: 800,
//     pending_quantity: 0,
//     cancelled_quantity: 0,
//     guid: '01XPy7wkjDgjGct',
//     market_protection: 0,
//     disclosed_quantity: 0,
//     tradingsymbol: 'NIFTY2321617750CE',
//     placed_by: 'NR0563',
//     status_message: 'null',
//     status_message_raw: 'null'
//   },
//   {
//     _id: new ObjectId("63eb678d6ae3372d975ccfbd"),
//     order_id: '230214401540267',
//     status: 'COMPLETE',
//     average_price: 188.7225,
//     quantity: 1000,
//     product: 'NRML',
//     transaction_type: 'SELL',
//     exchange_order_id: '1000000048997122',
//     order_timestamp: '2023-02-14 12:41:09',
//     variety: 'regular',
//     validity: 'DAY',
//     exchange: 'NFO',
//     exchange_timestamp: '2023-02-14 12:41:09',
//     order_type: 'MARKET',
//     price: 0,
//     filled_quantity: 1000,
//     pending_quantity: 0,
//     cancelled_quantity: 0,
//     guid: '01Xb4Aa6V6qCbx5',
//     market_protection: 0,
//     disclosed_quantity: 0,
//     tradingsymbol: 'NIFTY2321617750CE',
//     placed_by: 'NR0563',
//     status_message: 'null',
//     status_message_raw: 'null'
//   },
//   {
//     _id: new ObjectId("63eb678d6ae3372d975ccfa9"),
//     order_id: '230214401428527',
//     status: 'COMPLETE',
//     average_price: 179.22916667,
//     quantity: 1800,
//     product: 'NRML',
//     transaction_type: 'BUY',
//     exchange_order_id: '1000000044417939',
//     order_timestamp: '2023-02-14 12:18:23',
//     variety: 'regular',
//     validity: 'DAY',
//     exchange: 'NFO',
//     exchange_timestamp: '2023-02-14 12:18:23',
//     order_type: 'MARKET',
//     price: 0,
//     filled_quantity: 1800,
//     pending_quantity: 0,
//     cancelled_quantity: 0,
//     guid: '57936XBuE0BvOqTfm2',
//     market_protection: 0,
//     disclosed_quantity: 0,
//     tradingsymbol: 'NIFTY2321617750CE',
//     placed_by: 'NR0563',
//     status_message: 'null',
//     status_message_raw: 'null'
//   }
// ]