// const User = require("../models/User/userDetailSchema");
const TradingAlgo = require("../models/AlgoBox/tradingAlgoSchema");
const AccessToken = require("../models/Trading Account/requestTokenSchema");
const ApiKey = require("../models/Trading Account/accountSchema");
const UserPermission = require("../models/User/permissionSchema");
// const UserPermission = require("../models/User/permissionSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");


const ApplyAlgo = async (req, res, next)=>{

    // console.log(req.body, "in apply algo")
    // console.log(req.user)
    const {userId, symbol, instrumentToken, Quantity, buyOrSell} = req.body;

    let accessTokenDetails = await AccessToken.find({status: "Active"});
    let apiKeyDetails = await ApiKey.find({status: "Active"});
    let tradingAlgoData = await TradingAlgo.find({status: "Active"});
    let userPermission = await UserPermission.find({userId: userId});
    let instrumentMapping = await InstrumentMapping.find({Status: "Active"});


    let companyTrade = {};

    const tradingAlgoArr = [];
    apiKeyDetails.map((elem) => {
        accessTokenDetails.map((subelem) => {
            tradingAlgoData.map((element) => {
                if (element.status === "Active" && subelem.accountId == element.tradingAccount && elem.accountId == element.tradingAccount) {
                    tradingAlgoArr.push(element);
                }
            })
        })
    })

    const userPermissionAlgo = [];
    for (let elem of tradingAlgoArr) {
        for (let subElem of userPermission) {
            if (elem.algoName === subElem.algoName && subElem.isTradeEnable) {
                userPermissionAlgo.push(elem)
            }
        }
    }

    function instrumentMappingFunc(){
        let flag = true;
        for(let i = 0; i < instrumentMapping.length; i++){
          if(instrumentMapping[i].InstrumentNameIncoming === symbol){
            companyTrade.realSymbol = instrumentMapping[i].InstrumentNameOutgoing;
            companyTrade.real_instrument_token = instrumentMapping[i].OutgoingInstrumentCode;
            flag = false;
            break;
          }
          if(flag){
            companyTrade.realSymbol = symbol;
            companyTrade.real_instrument_token = instrumentToken;
          }
        }
    }

    async function tradingAlgo() {


        userPermissionAlgo?.map((elem) => {
    
            if(elem.transactionChange === "TRUE") {
                if(buyOrSell === "BUY"){
                    companyTrade.realBuyOrSell = "SELL"
                }
                else if(buyOrSell === "SELL"){
                    companyTrade.realBuyOrSell = "BUY"
                }
                
            }else if(elem.transactionChange === "FALSE"){
                if(buyOrSell === "BUY"){
                    companyTrade.realBuyOrSell = "BUY"
                }
                else if(buyOrSell === "SELL"){
                    companyTrade.realBuyOrSell = "SELL"
                }
            }else{
                return;
            }

            if(elem.instrumentChange === "TRUE"){
                instrumentMappingFunc();
            } else{
                companyTrade.realSymbol = symbol;
                companyTrade.real_instrument_token = instrumentToken;
            }

            companyTrade.realQuantity = elem.lotMultipler * (Quantity);
            let accessTokenParticular = accessTokenDetails.filter((element) => {
                return elem.tradingAccount === element.accountId
            })

            let apiKeyParticular = apiKeyDetails.filter((element) => {
                return elem.tradingAccount === element.accountId
            })
            // console.log("userPermission", userPermission)
    
            userPermission.map((subElem)=>{
                if(subElem.algoName === elem.algoName){
                    if(subElem.isRealTradeEnable && subElem.isTradeEnable){
                        // sendOrderReq(elem, checkingMultipleAlgoFlag, apiKeyParticular, accessTokenParticular);
                        const { apiKey } = apiKeyParticular[0];
                        const { accessToken } = accessTokenParticular[0];

                        req.body.realSymbol = companyTrade.realSymbol;
                        req.body.real_instrument_token = companyTrade.real_instrument_token;
                        req.body.realBuyOrSell = companyTrade.realBuyOrSell;
                        req.body.realQuantity = companyTrade.realQuantity;
                        req.body.apiKey = apiKey;
                        req.body.accessToken = accessToken;
                        req.body.algoBox = elem;
                        req.body.isAlgoTrader = req.user.isAlgoTrader

                    } else if(subElem.isTradeEnable){
                        // mockTradeCompany(elem, checkingMultipleAlgoFlag);
                        req.body.realSymbol = companyTrade.realSymbol;
                        req.body.real_instrument_token = companyTrade.real_instrument_token;
                        req.body.realBuyOrSell = companyTrade.realBuyOrSell;
                        req.body.realQuantity = companyTrade.realQuantity;
                        req.body.algoBox = elem;
                        req.body.isAlgoTrader = req.user.isAlgoTrader
                    }
                }
            })
    
        })

    }

    if(userPermissionAlgo?.length === 0){
        if(req.user.isAlgoTrader){
            return res.status(401).send({message: "Your profile is not active yet, please contact the admin @ team@stoxhero.com for more details."})
        } else{
            req.body.isAlgoTrader = req.user.isAlgoTrader
        }
    }
    await tradingAlgo();

    next();

}

module.exports = ApplyAlgo;