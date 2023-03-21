const express = require("express");
const router = express.Router();
require("../../db/conn");
// const Admin = require("../models/adminSchema");
const RetreiveOrder = require("../../models/TradeDetails/retreiveOrder");
const LiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const MockCompany = require("../../models/mock-trade/mockTradeCompanySchema");
const RetreiveTrade = require("../../models/TradeDetails/retireivingTrade")
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const dbBackup = require("../../Backup/mongoDbBackUp")
const newdbBackup = require("../../Backup/newBackup")


router.get("/dbbackup", async (req, res)=>{
  // const sourceUri = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority"
  // const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"
  const sourceUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";

  const targetUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"

  await dbBackup.backupDatabase(sourceUri, targetUri);

})

router.get("/dbCopyAndDelete", async (req, res)=>{

  // const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"

  // const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"
  const targetUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";

  await newdbBackup.deleteDb(targetUri);
  // await newdbBackup.copy(sourceUri, targetUri);

})

router.get("/missedOrderId", async (req, res)=>{

    // console.log("in missed order id")
    const missedOrderId = await RetreiveOrder.aggregate([
        {
          $match: {
            order_timestamp: { $regex: "2023-02-16" },
            // quantity: realQuantity,
            // tradingsymbol: realSymbol,
            status: "COMPLETE",
            tradingsymbol: "NIFTY2321618200PE"
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

router.get("/insertDocument", async (req, res)=>{
// 2023-02-13 12:04:35

const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


const getTrade = await RetreiveTrade.find(
    {order_timestamp: {$lt: "2023-02-13 12:04:21"}}
 ).sort({order_timestamp: -1})

for(let i = 0; i < getTrade.length; i++){
  let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
    order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
    pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
    status_message, status_message_raw} = getTrade[i];

    if(transaction_type === "SELL"){
      quantity = -quantity;
    }
    if(!status_message){
      status_message = "null"
    }
    if(!status_message_raw){
        status_message_raw = "null"
    }
    if(!exchange_timestamp){
        exchange_timestamp = "null"
    }
    if(!exchange_order_id){
        exchange_order_id = "null"
    }

    let instrumentToken;
    if(tradingsymbol === "NIFTY2321618000PE"){
      instrumentToken = "11290626";
    } else if(tradingsymbol === "NIFTY2321617750CE"){
      instrumentToken = "11286786"
    }

  let trade_time = order_timestamp
  let timestamp = order_timestamp.split(" ");
  let timestampArr = timestamp[0].split("-");
  let new_order_timestamp = `${timestampArr[2]}-${timestampArr[1]}-${timestampArr[0]} ${timestamp[1]}`

  function buyBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
      // let totalAmount = Number(Details.last_price) * Number(quantity);
      let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
      // console.log("exchangeCharge", exchangeCharge, totalAmount, (Number(brokerageDetailBuy[0].exchangeCharge)));
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
      // console.log("stampDuty", stampDuty);
      let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
  }

  function sellBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
      // let totalAmount = Number(Details.last_price) * Number(quantity);
      let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

      return finalCharge
  }

  let brokerageCompany;
  let brokerageUser;

  if(transaction_type === "BUY"){
      brokerageCompany = buyBrokerage(Math.abs(Number(quantity)) * average_price);
  } else{
      brokerageCompany = sellBrokerage(Math.abs(Number(quantity)) * average_price);
  }


  if(tradingsymbol === "NIFTY2321618000PE" || tradingsymbol === "NIFTY2321617750CE"){

    LiveCompany.findOne({order_id : order_id})
    .then((dataExist)=>{
        if(dataExist && dataExist.order_timestamp !== new_order_timestamp && checkingMultipleAlgoFlag === 1){
            // console.log("data already in real company");
            return res.status(422).json({error : "data already exist..."})
        }
        const tempDate = new Date();
        let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
        function addMinutes(date, hours) {
          date.setMinutes(date.getMinutes() + hours);
          return date;
        }
        const date = new Date(temp_order_save_time);
        const newDate = addMinutes(date, 330);
        const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);

        const companyTradeData = new LiveCompany({
            disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
            status, uId: Date.now(), createdBy: "Error", average_price, Quantity: quantity, 
            Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
            variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId: "error@ninepointer.in",
            algoBox:{algoName: "Transaction Algo", transactionChange: "TRUE", instrumentChange: "FALSE", exchangeChange: "FALSE", 
            lotMultipler: "1", productChange: "FALSE", tradingAccount: "NR0563", _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true}, order_id, instrumentToken: instrumentToken, 
            brokerage: brokerageCompany,
            tradeBy: "Error", isRealTrade: true, amount: (Number(quantity)*average_price), trade_time:trade_time,
            order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed: false


        });
        // console.log("this is REAL CompanyTradeData", companyTradeData);
        companyTradeData.save().then(()=>{
          console.log("saving data in live", i)
        }).catch((err)=> res.status(500).json({error:"Failed to Trade company side"}));
    }).catch(err => {console.log( err,"fail company live data saving")});


    MockCompany.findOne({order_id : order_id})
    .then((dataExist)=>{
        if(dataExist && dataExist.order_timestamp !== new_order_timestamp && checkingMultipleAlgoFlag === 1){
            // console.log("data already in mock company");
            return res.status(422).json({error : "date already exist..."})
        }
        const tempDate = new Date();
        let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
        function addMinutes(date, hours) {
          date.setMinutes(date.getMinutes() + hours);
          return date;
        }
        const date = new Date(temp_order_save_time);
        const newDate = addMinutes(date, 330);
        const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);

        const mockTradeDetails = new MockCompany({

          status, uId: Date.now(), createdBy: "Error", average_price, Quantity: quantity, 
          Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
          variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId: "error@ninepointer.in",
          algoBox:{algoName: "Transaction Algo", transactionChange: "TRUE", instrumentChange: "FALSE", exchangeChange: "FALSE", 
          lotMultipler: "1", productChange: "FALSE", tradingAccount: "NR0563", _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true}, order_id, instrumentToken: instrumentToken, 
          brokerage: brokerageCompany,
          tradeBy: "Error", isRealTrade: false, amount: (Number(quantity)*average_price), trade_time:trade_time,
          order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed: false

        });

        // console.log("mockTradeDetails comapny", mockTradeDetails);
        mockTradeDetails.save().then(()=>{
          console.log("saving data in live", i)
            // res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail company mock in placeorder")});
  }
}

console.log(getTrade.length)
res.send(getTrade)

})

module.exports = router;


// todo--> login auto, db entry ui, cronejob of 13, 14 with delete entry