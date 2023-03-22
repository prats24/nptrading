const axios = require("axios")
// const getOrderData = require("./retrieveOrder");
// const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const CompanyTradeData = require("../models/TradeDetails/liveTradeSchema");
// const TradeData = require("../models/TradeDetails/allTradeSchema"); 
// const UserTradeData = require("../models/TradeDetails/liveTradeUserSchema")
const MockTradeCompany = require("../models/mock-trade/mockTradeCompanySchema")
// const MockTradeUser = require("../models/mock-trade/mockTradeUserSchema");
// const RetreiveOrder = require("../models/TradeDetails/retreiveOrder");
const TradingAlgo = require("../models/AlgoBox/tradingAlgoSchema");
const AccessToken = require("../models/Trading Account/requestTokenSchema");
const ApiKey = require("../models/Trading Account/accountSchema");
// const UserPermission = require("../models/User/permissionSchema");
const liveTrade = require("./liveTrade");


exports.switchAlgoCheck = async (reqBody, res) => {

    const {userId, isChecked} = reqBody
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    let mockTradeDetail = await MockTradeCompany.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            userId: userId
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchange: "$exchange",
              validity: "$validity",
              order_type: "$order_type",
              variety: "$variety",
              algoBoxName: "$algoBox.algoName",
              name: "$tradeBy"
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              }
            }
          }
        }
    ])

    let liveTradeDetail = await CompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            userId: userId
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchange: "$exchange",
              validity: "$validity",
              order_type: "$order_type",
              variety: "$variety",
              algoBoxName: "$algoBox.algoName",
              name: "$tradeBy"
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              }
            }
          }
        }
    ])

    let accessTokenDetails = await AccessToken.find({status: "Active"});
    let apiKeyDetails = await ApiKey.find({status: "Active"});
    let tradingAlgoData = await TradingAlgo.find({status: "Active"});

    if(isChecked){
        // in real trade...square off
        takeTrade(liveTradeDetail)

    } else{
        takeTrade(mockTradeDetail)
    }


    function takeTrade(tradeDetailArr){
        let sendSingleResp = true;
        for(let i = 0; i < tradeDetailArr.length; i++){
            let usedAlgoBox = tradingAlgoData.filter((elem)=>{
                return elem.algoName === tradeDetailArr[i]._id.algoBoxName;
            })

            let apiKeyArr = apiKeyDetails.filter((elem)=>{
                return elem.accountId == usedAlgoBox[0]?.tradingAccount
                
            })

            let accessTokenArr = accessTokenDetails.filter((elem)=>{
                return elem.accountId == usedAlgoBox[0]?.tradingAccount
                
            })

            let transaction_type = tradeDetailArr[i].lots > 0 ? "BUY" : "SELL";
            let quantity = Math.abs(tradeDetailArr[i].lots);

            let realBuyOrSell, buyOrSell;
            if(transaction_type === "BUY"){
                realBuyOrSell = "SELL";
            } else{
                realBuyOrSell = "BUY";
            }

            if(usedAlgoBox[0].transactionChange === "TRUE"){
                if(realBuyOrSell === "BUY"){
                    buyOrSell = "SELL";
                } else{
                    buyOrSell = "BUY";
                }
            } else{
                if(realBuyOrSell === "BUY"){
                    buyOrSell = "BUY";
                } else{
                    buyOrSell = "SELL";
                }
            }

            let detailObj = {
                realSymbol: tradeDetailArr[i]._id.symbol,
                Product: tradeDetailArr[i]._id.product,
                instrumentToken: tradeDetailArr[i]._id.instrumentToken,
                exchange: tradeDetailArr[i]._id.exchange,
                validity: tradeDetailArr[i]._id.validity,
                OrderType: tradeDetailArr[i]._id.order_type,
                variety: tradeDetailArr[i]._id.variety,
                realBuyOrSell: realBuyOrSell,
                buyOrSell: buyOrSell,
                createdBy: tradeDetailArr[i]._id.name,
                switching: true,
                apiKey: apiKeyArr[0].apiKey,
                accessToken: accessTokenArr[0].accessToken,
                algoBox: usedAlgoBox[0],
                userId: userId,
                tradeBy: "System"
            }

            let interval = setInterval(() => {
                if (quantity > 1800) {
                    detailObj.realQuantity = 1800;
                    detailObj.Quantity = 1800/usedAlgoBox[0].lotMultipler 
                    liveTrade.liveTrade(detailObj, res);
                    quantity = quantity - 1800;
                } else {
                    console.log("quantity", quantity, (new Date()).getMilliseconds())
                    if(quantity>0){
                        sendSingleResp = false;
                        detailObj.realQuantity = quantity;
                        detailObj.Quantity = quantity/usedAlgoBox[0].lotMultipler ;
                        detailObj.sendSingleResp = false;
                        liveTrade.liveTrade(detailObj, res);
                        
                    } 
                    clearInterval(interval);
                }
            }, 300);
        }

        // if(sendSingleResp){
        //     res.status(201).json({message : `Quantity is 0`})
        // }
    }


}