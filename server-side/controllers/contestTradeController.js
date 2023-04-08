const ContestTrade = require('../models/Contest/ContestTrade');

// const MockTradeDetails = require("../models/mock-trade/mockTradeCompanySchema");
// const MockTradeDetailsUser = require("../models/mock-trade/mockTradeUserSchema");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
// const MockTradeDetailsTrader = require("../models/mock-trade/mockTradeTraders");

const uuid = require('uuid');


exports.newTrade = async (reqBody, res) => {

  const contestId = req.params.id;

  let {  exchange, symbol, buyOrSell, Quantity, Price, 
        Product, OrderType, TriggerPrice, stopLoss, uId,
        validity, variety, createdBy, order_id:dummyOrderId,
        userId, instrumentToken, trader } = reqBody 


    const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
    const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


  if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety){
      //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
      return res.status(422).json({error : "please fill all the feilds..."})
  }

  if(buyOrSell === "SELL"){
      Quantity = "-"+Quantity;
  }


  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let originalLastPriceUser;
  let newTimeStamp = "";
  let trade_time = "";
  try{
      
      let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
      for(let elem of liveData.data){
          if(elem.instrument_token == instrumentToken){
              newTimeStamp = elem.timestamp;
              originalLastPriceUser = elem.last_price;
          }
          if(elem.instrument_token == real_instrument_token){
              originalLastPriceCompany = elem.last_price;
          }
      }

      trade_time = newTimeStamp;
      let firstDateSplit = (newTimeStamp).split(" ");
      let secondDateSplit = firstDateSplit[0].split("-");
      newTimeStamp = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]} ${firstDateSplit[1]}`


  } catch(err){
      return new Error(err);
  }



  function buyBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
      let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
  }

  function sellBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
      let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge
  }

  let brokerageUser;


  if(buyOrSell === "BUY"){
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  } else{
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  }
  
  ContestTrade.findOne({order_id : order_id})
  .then((dateExist)=>{
      if(dateExist){
          //console.log("data already");
          return res.status(422).json({error : "date already exist..."})
      }

      const contestTrade = new ContestTrade({
          status:"COMPLETE", uId, createdBy, average_price: originalLastPriceUser, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
          variety, validity, exchange, order_type: OrderType, symbol, placed_by: "ninepointer", userId,
          order_id, instrumentToken, brokerage: brokerageUser, contestId: contestId,
          tradeBy: createdBy,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
          
      });

      //console.log("mockTradeDetails", mockTradeDetailsUser);
      contestTrade.save().then(()=>{
          console.log("sending response");
          res.status(201).json({status: 'Complete', message: 'COMPLETE'});
      }).catch((err)=> {
          console.log("in err", err)
          // res.status(500).json({error:"Failed to enter data"})
      });
      

  }).catch(err => {console.log("fail")});  
  

}
// exports.newTrade = async(req,res,next) => {
//     const userId = req.user._id;
//     const contestId = req.params.id;
//     const{
      
//         average_price, Quantity, Product, buyOrSell, variety, validity, order_type, symbol, placed_by, brokerage, instrumentToken,
//         amount, trade_time 
//     } = req.body;
//     try{
//         const newTrade = await ContestTrade.create({
//             order_id: uuid.v4(), contestId: contestId, status, average_price, Quantity,
//             Product, buyOrSell, variety, validity, order_type, symbol, placed_by, 
//             brokerage, instrumentToken, tradeBy: userId, amount, trade_time, trader: userId, createdBy: userId 
//         });
//         res.status(201).json({status: 'success', message:'Trade placed successfully.'});
//     }catch(e){
//         console.log(e);
//         return res.status(500).json({status: 'error', message: 'Something went wrong'});
//     }


    

// }

exports.checkContestTradeEligibility = async(req, res,next) => {

}

exports.currentUser = async (req, res, next) => {
    req.params.userId = req.user._id;
}

exports.getUserTrades = async(req,res,next) => {
    const{userId, id} = req.params;
    try{
        const userTrades = await ContestTrade.find({contestId: id, "participants.userId": userId});
        res.status(200).json({status:'success', data: userTrades, results: userTrades.length});
    }catch(e){
        console.log(e);
        return res.status(500).json({status: 'error', message: 'Something went wrong.'})
    }


}

exports.getContestPnl = async(req, res, next) => {
    const {userId, id} = req.params;
    const today = new Date().toISOString().slice(0, 10);

    try{
        let pnlDetails = await ContestTrade.aggregate([
            {
              $match: {
                trade_time: {
                  $regex: today,
                },
                status: "COMPLETE",
                userId: id
              },
            },
            {
              $group: {
                _id: {
                  symbol: "$symbol",
                  product: "$Product",
                  instrumentToken: "$instrumentToken",
                  exchange: "$exchange"
                },
                amount: {
                  $sum: {$multiply : ["$amount",-1]},
                },
                brokerage: {
                  $sum: {
                    $toDouble: "$brokerage",
                  },
                },
                lots: {
                  $sum: {
                    $toInt: "$Quantity",
                  },
                },
                lastaverageprice: {
                  $last: "$average_price",
                },
              },
            },
            {
              $sort: {
                _id: -1,
              },
            },
          ]);

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }
}