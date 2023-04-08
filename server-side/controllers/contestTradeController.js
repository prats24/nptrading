const ContestTrade = require('../models/Contest/ContestTrade');
const uuid = require('uuid');

exports.newTrade = async(req,res,next) => {
    const userId = req.user._id;
    const contestId = req.params.id;
    const{
        average_price, Quantity, Product, buyOrSell, variety, validity, order_type, symbol, placed_by, brokerage, instrumentToken,
        amount, trade_time 
    } = req.body;
    try{
        const newTrade = await ContestTrade.create({
            order_id: uuid.v4(), contestId: contestId, status, average_price, Quantity,
            Product, buyOrSell, variety, validity, order_type, symbol, placed_by, 
            brokerage, instrumentToken, tradeBy: userId, amount, trade_time, trader: userId, createdBy: userId 
        });
        res.status(201).json({status: 'success', message:'Trade placed successfully.'});
    }catch(e){
        console.log(e);
        return res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
    

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