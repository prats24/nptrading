const ContestTrade = require('../models/Contest/ContestTrade');

// const MockTradeDetails = require("../models/mock-trade/mockTradeCompanySchema");
// const MockTradeDetailsUser = require("../models/mock-trade/mockTradeUserSchema");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
// const MockTradeDetailsTrader = require("../models/mock-trade/mockTradeTraders");
const axios = require('axios')
const uuid = require('uuid');
const ObjectId = require('mongodb').ObjectId;
const Contest = require('../models/Contest/contestSchema');
const autoTrade = require('../PlaceOrder/autoTradeContest')
const client = require('../marketData/redisClient');


exports.newTrade = async (req, res, next) => {

  const contestId = req.params.id;

  let {  exchange, symbol, buyOrSell, Quantity, Price, 
        Product, OrderType, TriggerPrice, stopLoss, uId,
        validity, variety, createdBy, order_id,
        userId, instrumentToken, trader, portfolioId, autoTrade, dontSendResp} = JSON.parse(JSON.stringify(req.body));

        let tradeBy ;
        if(autoTrade){
          tradeBy = new ObjectId("63ecbc570302e7cf0153370c")
        } else{
          tradeBy = req.user._id
        }
        console.log("req.body", req.body)

    const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
    const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


  if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety){
      //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
      if(!dontSendResp){
        return res.status(422).json({error : "please fill all the feilds..."})
      } else{
        return;
      }
  }

  if(buyOrSell === "SELL"){
      Quantity = "-"+Quantity;
  }

  console.log("1st")

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
          // if(elem.instrument_token == real_instrument_token){
          //     originalLastPriceCompany = elem.last_price;
          // }
      }

      trade_time = newTimeStamp;
      let firstDateSplit = (newTimeStamp).split(" ");
      let secondDateSplit = firstDateSplit[0].split("-");
      newTimeStamp = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]} ${firstDateSplit[1]}`


  } catch(err){
    // console.log(err)
      return new Error(err);
  }

  console.log("2nd")

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

  // console.log("3st")
  if(buyOrSell === "BUY"){
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  } else{
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  }
  
  ContestTrade.findOne({order_id : order_id})
  .then((dateExist)=>{
      if(dateExist){
          //console.log("data already");
          if(!dontSendResp){
            return res.status(422).json({error : "date already exist..."})
          } else{
            return;
          }
          
      }


      // console.log("4st")
      const contestTrade = new ContestTrade({
          status:"COMPLETE", uId, createdBy, average_price: originalLastPriceUser, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
          variety, validity, exchange, order_type: OrderType, symbol, placed_by: "ninepointer", userId,
          order_id, instrumentToken, brokerage: brokerageUser, contestId: contestId,
          tradeBy: tradeBy,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time, portfolioId
          
      });

      // console.log("mockTradeDetails", mockTradeDetailsUser);
      contestTrade.save().then(()=>{
          console.log("sending response");
          if(!dontSendResp){
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});
          }
      }).catch((err)=> {
          console.log("in err", )
          // res.status(500).json({error:"Failed to enter data"})
      });
      
      // console.log("5st")
  }).catch(err => {console.log( "fail")});  
  
  // console.log("6st")

}

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
  // console.log("in get contest")
    const userId = req.user._id;
    const contestId = req.params.id;
    const portfolioId = req.query.portfolioId;
    const today = new Date().toISOString().slice(0, 10);
    // console.log("in getContestPnl", userId, contestId, portfolioId, today)
    try{
        let pnlDetails = await ContestTrade.aggregate([
            {
              $match: {
                trade_time: {
                  $regex: today,
                },
                status: "COMPLETE",
                trader: userId,
                contestId: new ObjectId(contestId),
                // portfolioId: new ObjectId(portfolioId)
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

        res.status(201).json(pnlDetails);

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }
}

exports.getContestHistoryPnl = async(req, res, next) => {
  // console.log("in get contest")
    const userId = req.user._id;
    const contestId = req.params.id;
    const portfolioId = req.query.portfolioId;
    // console.log("in getContestPnl", userId, contestId, portfolioId, today)
    try{
        let pnlDetails = await ContestTrade.aggregate([
            {
              $match: {
                status: "COMPLETE",
                trader: userId,
                contestId: new ObjectId(contestId),
                // portfolioId: new ObjectId(portfolioId)
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

        res.status(201).json(pnlDetails);

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }
}

exports.getContestRank = async (req, res, next) => {
    const contestId = req.params.id;
    try{

        const ranks = await ContestTrade.aggregate([
            // Match documents for the given contestId
            {
              $match: {
                contestId: new ObjectId(contestId)
              }
            },
            // Group by userId and sum the amount
            {
              $group: {
                _id: {
                  trader: "$trader",
                  createdBy: "$createdBy",
                  instrumentToken: "$instrumentToken"
                },
                totalAmount: { $sum: "$amount" },
                investedAmount: {
                  $sum: {
                    $abs: "$amount"
                  }
                },
                brokerage: {
                  $sum: {
                    $toDouble: "$brokerage",
                  },
                },
                lots: {
                    $sum: {$toInt : "$Quantity"}
                }
              }
            },
            // Sort by totalAmount in descending order
            {
              $sort: {
                totalAmount: -1
              }
            },
            // Project the result to include only userId and totalAmount
            {
              $project: {
                _id: 0,
                userId: "$_id",
                totalAmount: 1,
                investedAmount: 1,
                brokerage: 1,
                lots: 1
              }
            },
          ]);
        
        if(!ranks){
            return res.status(404).json({status:'error', message:'No ranking for the contest'});
        }
        
        res.status(200).json({status: 'success', results: ranks.length, data: ranks});
    }catch(e){
      console.log(e)
        res.status(500).json({status:'error', message: 'Something went wrong'});
    }
}

exports.getMyContestRank = async (req, res, next) => {
    const contestId = req.params.id;
    const userId = req.user._id;

    try{

        const ranks = await ContestTrade.aggregate([
            // Match documents for the given contestId
            {
              $match: {
                contestId: new ObjectId(contestId)
              }
            },
            // Group by userId and sum the amount
            {
              $group: {
                _id: {
                  trader: "$trader",
                  createdBy: "$createdBy",
                  instrumentToken: "$instrumentToken"
                },
                totalAmount: { $sum: "$amount" },
                investedAmount: {
                  $sum: {
                    $abs: "$amount"
                  }
                },
                brokerage: {
                  $sum: {
                    $toDouble: "$brokerage",
                  },
                },
                lots: {
                    $sum: {$toInt : "$Quantity"}
                }
              }
            },
            // Sort by totalAmount in descending order
            {
              $sort: {
                totalAmount: -1
              }
            },
            // Project the result to include only userId and totalAmount
            {
              $project: {
                _id: 0,
                userId: "$_id",
                totalAmount: 1,
                investedAmount: 1,
                brokerage: 1,
                lots: 1
              }
            },
          ]);
        // console.log(ranks, userId)
        if(!ranks){
            return res.status(404).json({status:'error', message:'No ranking for the contest'});
        }
        const user = ranks.filter(obj => (obj.userId.trader).toString() === (userId).toString());
        const index = ranks.findIndex(obj => (obj.userId.trader).toString() === (userId).toString());
        if(index == -1){
            return res.status(404).json({status: 'error', message: 'User doesn\'t have a rank'});
        }
        
        res.status(200).json({status: 'success', data: {rank: index+1, data: user}});
    }catch(e){
        res.status(500).json({status:'error', message: 'Something went wrong'});
    }


}

exports.autoTradeContest = async(req, res, next) => {
  // console.log("in get contest")
    // const userId = req.user._id;
    // const contestId = req.params.id;
    // const portfolioId = req.query.portfolioId;
    const now = new Date();
    const thirtyMinutesBeforeNow = new Date(now.getTime() - 30 * 60000); // 30 minutes * 60 seconds * 1000 milliseconds

    const today = new Date().toISOString().slice(0, 10);
    console.log(now)
    const contests = await Contest.find({
      contestEndDate: {
        $gte: thirtyMinutesBeforeNow,
        $lte: now,
      },
    }
    );


    console.log(contests)
    const userIds = contests.map(async (contest) => {
      // console.log(contest._id)
      req.params.id = contest._id;
      let openTrade = await ContestTrade.aggregate([
        {
          $match:
            {
              contestId: contest._id
            },
        },
        {
          $group:
            {
              _id: {
                portfolioId: "$portfolioId",
                symbol: "$symbol",
                instrumentToken: "$instrumentToken",
                trader: "$trader",
                product: "$Product",
                exchange: "$exchange",
                validity: "$validity",
                order_type: "$order_type",
                variety: "$variety",
                name: "$createdBy",
              },
              lots: {
                $sum: {
                  $toInt: "$Quantity",
                },
              },
            },
        },
      ])
  
      // console.log("open trade", openTrade)
  
      // res.status(201).json(openTrade);
      await autoTrade.switchAllTrade(openTrade, res, req)
      return contest.participants.map((participant) => {
        return participant.userId;
      });
    
    })

    // console.log(await userIds)
    // try{
    //     let pnlDetails = await ContestTrade.aggregate([
    //         {
    //           $match: {
    //             trade_time: {
    //               $regex: today,
    //             },
    //             status: "COMPLETE",
    //             trader: userId,
    //             contestId: new ObjectId(contestId),
    //             // portfolioId: new ObjectId(portfolioId)
    //           },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               symbol: "$symbol",
    //               product: "$Product",
    //               instrumentToken: "$instrumentToken",
    //               exchange: "$exchange"
    //             },
    //             amount: {
    //               $sum: {$multiply : ["$amount",-1]},
    //             },
    //             brokerage: {
    //               $sum: {
    //                 $toDouble: "$brokerage",
    //               },
    //             },
    //             lots: {
    //               $sum: {
    //                 $toInt: "$Quantity",
    //               },
    //             },
    //             lastaverageprice: {
    //               $last: "$average_price",
    //             },
    //           },
    //         },
    //         {
    //           $sort: {
    //             _id: -1,
    //           },
    //         },
    //     ]);

    //     

    // }catch(e){
    //     console.log(e);
    //     return res.status(500).json({status:'success', message: 'something went wrong.'})
    // }

}

exports.getLastFiveTrade = async(req, res, next) => {
    const userId = req.user._id;
    const contestId = req.params.id;

    try{
      const lastTrade = await ContestTrade.find({trader: userId, contestId: contestId}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1}).sort({_id: -1});
      res.status(200).json({status: 'success', data: lastTrade});
    }catch(e){
      console.log(e)
        res.status(500).json({status:'error', message: 'Something went wrong'});
    }

}



exports.editLeaderboard = async(req,res,next) => {
  const {id} = req.params;
  const {userData, score} = req.body;
  await client.ZADD(`contest:${id}`, score, JSON.stringify(userData));
}


exports.getLeaderBoard = async(req,res,next) => {
  const leaderBoard = await client.ZREVRANGE(`contest:${id}`, 0, 19, 'WITHSCORES');
  
  res.status(200).json({
    status: 'success',
    results: leaderBoard.length,
    data: leaderBoard
  });  

}

exports.getMyLeaderBoardRank = async(req,res, next) => {
  const {id} = req.params.id;
  const userData = {userId: req.user._id, name: req.user.firstName + ' '+ req.user.lastName};
  const myRank = await ZREVRANK(`contest:${id}`, JSON.stringify(userData));

  res.status(200).json({
    status: 'success',
    data: myRank,
  });
}
