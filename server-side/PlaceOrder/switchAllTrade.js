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


exports.switchAllTrade = async (reqBody, res) => {

    const {userId, isChecked, tradingAlgo} = reqBody
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    let mockTradeDetail = await MockTradeCompany.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
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
              name: "$tradeBy",
              userId: "$userId"
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
              $regex: todayDate
            },
            status: "COMPLETE",
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
              name: "$tradeBy",
              userId: "$userId"
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

    if(!isChecked){
        // in real trade...square off
        takeTrade(liveTradeDetail, true)

    } else{
        takeTrade(mockTradeDetail, false)
    }


    function takeTrade(data, isSquaringOff){
        data.map((elem) => {
          if(elem.lots && elem._id.algoBoxName === tradingAlgo.algoName){
      
            let apiKeyArr = apiKeyDetails.filter((elem) => {
              return elem.accountId == tradingAlgo?.tradingAccount
            });
        
            let accessTokenArr = accessTokenDetails.filter((elem) => {
              return elem.accountId == tradingAlgo?.tradingAccount
            });
        
            let transaction_type = elem.lots > 0 ? "BUY" : "SELL";
            let quantity = Math.abs(elem.lots);

            let realBuyOrSell, buyOrSell;
            // if(transaction_type === "BUY"){
            //     realBuyOrSell = "SELL";
            // } else{
            //     realBuyOrSell = "BUY";
            // }

            // if(usedAlgoBox[0].transactionChange === "TRUE"){
            //     if(realBuyOrSell === "BUY"){
            //         buyOrSell = "SELL";
            //     } else{
            //         buyOrSell = "BUY";
            //     }
            // } else{
            //     if(realBuyOrSell === "BUY"){
            //         buyOrSell = "BUY";
            //     } else{
            //         buyOrSell = "SELL";
            //     }
            // }

            let detailObj = {
              realSymbol: elem._id.symbol,
              symbol: elem._id.symbol,
              Product: elem._id.product,
              instrumentToken: elem._id.instrumentToken,
              exchange: elem._id.exchange,
              validity: elem._id.validity,
              OrderType: elem._id.order_type,
              variety: elem._id.variety,
              buyOrSell: transaction_type,
              createdBy: elem._id.name,
              userId: elem._id.userId,
              switching: true,
              apiKey: apiKeyArr[0].apiKey,
              accessToken: accessTokenArr[0].accessToken,
              algoBox: tradingAlgo,
              tradeBy: "System",

            };
      
            if(isSquaringOff){
              let new_transaction_type = (transaction_type === "SELL") ? "BUY" : "SELL";
              detailObj.realBuyOrSell = new_transaction_type;

              if(tradingAlgo?.transactionChange === "TRUE"){
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

              detailObj.buyOrSell = buyOrSell;

              let interval = setInterval(() => {
                if (quantity > 1800) {
                    // console.log("quantity", 1800, (new Date()).getMilliseconds())
                    detailObj.realQuantity = 1800;
                    detailObj.Quantity = 1800/tradingAlgo?.lotMultipler 

                    liveTrade.liveTrade(detailObj, res);

                //   placeLiveOrder(tradingAlgo, detailObj, apiKeyArr, accessTokenArr, new_transaction_type, 1800);
                  quantity = quantity - 1800;
                } else {
                    // console.log("quantity", quantity, (new Date()).getMilliseconds())
                    detailObj.realQuantity = quantity;
                    detailObj.Quantity = quantity/tradingAlgo?.lotMultipler 
                    liveTrade.liveTrade(detailObj, res);

                //   placeLiveOrder(tradingAlgo, detailObj, apiKeyArr, accessTokenArr, new_transaction_type, quantity);
                  clearInterval(interval);
                }
              }, 300);
              
            } else{
              let interval = setInterval(() => {
                if (quantity > 1800) {
                    detailObj.realQuantity = 1800;
                    detailObj.Quantity = 1800/tradingAlgo?.lotMultipler 

                    liveTrade.liveTrade(detailObj, res);
                    // console.log("quantity", 1800, (new Date()).getMilliseconds())
                //   placeLiveOrder(tradingAlgo, detailObj, apiKeyArr, accessTokenArr, transaction_type, 1800);
                  quantity = quantity - 1800;
                } else {
                    detailObj.realQuantity = quantity;
                    detailObj.Quantity = quantity/tradingAlgo?.lotMultipler 

                    liveTrade.liveTrade(detailObj, res);
                    // console.log("quantity", quantity, (new Date()).getMilliseconds())
                //   placeLiveOrder(tradingAlgo, detailObj, apiKeyArr, accessTokenArr, transaction_type, quantity);
                  clearInterval(interval);
                }
              }, 300);
            }
      
          }
        });
    }


}