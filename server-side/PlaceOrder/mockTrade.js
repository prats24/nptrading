const axios = require("axios")
const MockTradeDetails = require("../models/mock-trade/mockTradeCompanySchema");
const MockTradeDetailsUser = require("../models/mock-trade/mockTradeUserSchema");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");



exports.mockTrade = async (reqBody, res) => {

    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType,
        validity, variety, createdBy, userId, uId, algoBox, order_id, instrumentToken,  
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader } = reqBody 


    const {algoName, transactionChange, instrumentChange
      , exchangeChange, lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault} = algoBox

      const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
      const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety || !algoName || !transactionChange || !instrumentChange || !exchangeChange || !lotMultipler || !productChange || !tradingAccount){
        //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        realQuantity = "-"+realQuantity;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let originalLastPriceUser;
    let originalLastPriceCompany;
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
    let brokerageCompany;

    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    }
    
    MockTradeDetails.findOne({order_id : order_id})
    .then((dateExist)=>{
        if(dateExist && dateExist.order_timestamp !== newTimeStamp && checkingMultipleAlgoFlag === 1){
            console.log("data already in mock company", checkingMultipleAlgoFlag);
            return res.status(422).json({error : "date already exist..."})
        }

        const mockTradeDetails = new MockTradeDetails({
            status:"COMPLETE", uId, createdBy, average_price: originalLastPriceCompany, Quantity: realQuantity, 
            Product, buyOrSell:realBuyOrSell, order_timestamp: newTimeStamp,
            variety, validity, exchange, order_type: OrderType, symbol: realSymbol, placed_by: "ninepointer", userId,
                algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
            lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken: real_instrument_token, brokerage: brokerageCompany,
            tradeBy: createdBy,trader : trader, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), trade_time:trade_time,
            
        });

        // console.log("mockTradeDetails comapny", mockTradeDetails);
        mockTradeDetails.save().then(()=>{
            
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        
    }).catch(err => {console.log(err, "fail")});

    MockTradeDetailsUser.findOne({order_id : order_id})
    .then((dateExist)=>{
        if(dateExist){
            //console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }

        const mockTradeDetailsUser = new MockTradeDetailsUser({
            status:"COMPLETE", uId, createdBy, average_price: originalLastPriceUser, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "ninepointer", userId,
            isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, 
            tradeBy: createdBy,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            
        });

        //console.log("mockTradeDetails", mockTradeDetailsUser);
        mockTradeDetailsUser.save().then(()=>{
            console.log("sending response");
            res.status(201).json({status: 'Complete', message: 'Trade Succesful'});
        }).catch((err)=> {
            console.log("in err", err)
            // res.status(500).json({error:"Failed to enter data"})
        });
        

    }).catch(err => {console.log("fail")});

}