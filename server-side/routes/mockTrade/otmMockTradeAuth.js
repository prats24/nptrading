const express = require("express");
const router = express.Router();
require("../../db/conn");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const OtmMock = require("../../models/mock-trade/otmMockSchema");
const axios = require('axios');

// avg price, instrument token and amount
router.post("/mockOtmtradecompany", async (req, res)=>{

    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType,
          validity, variety, createdBy, userId, uId, algoBox, order_id, instrumentToken,  
          realBuyOrSell, realQuantity, otm, otm_quantity, otm_token} = req.body 

        //console.log("otm body",req.body);
        // //console.log("in the company auth");
    const {algoName, transactionChange, instrumentChange
        , exchangeChange, lotMultipler, productChange, tradingAccount} = algoBox

        const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
        const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety || !algoName || !transactionChange || !instrumentChange || !exchangeChange || !lotMultipler || !productChange || !tradingAccount){
        //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
        //console.log("data nhi h pura");
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        realQuantity = "-"+realQuantity;
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    let originalLastPrice;
    let otmLastPrice;
    let newTimeStamp = "";
    let trade_time = "";
    try{
        
        let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
        
        for(let elem of liveData.data){
            //console.log(elem)
            if(elem.instrument_token == instrumentToken){
                newTimeStamp = elem.timestamp;
                originalLastPrice = elem.last_price;
                //console.log("originalLastPrice ", originalLastPrice)
            }
            if(elem.instrument_token == otm_token){
                otmLastPrice = elem.last_price;
                //console.log("otmLastPrice ", otmLastPrice)
            }
        }

        trade_time = newTimeStamp;
        let firstDateSplit = (newTimeStamp).split(" ");
        let secondDateSplit = firstDateSplit[0].split("-");
        newTimeStamp = `${secondDateSplit[2]}-${secondDateSplit[1]}-${secondDateSplit[0]} ${firstDateSplit[1]}`


    } catch(err){
        return new Error(err);
    }

    //console.log("newTimeStamp", newTimeStamp);


    function buyBrokerage(totalAmount){
        let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
        // let totalAmount = Number(Details.last_price) * Number(quantity);
        let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
        // //console.log("exchangeCharge", exchangeCharge, totalAmount, (Number(brokerageDetailBuy[0].exchangeCharge)));
        let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
        let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
        // //console.log("stampDuty", stampDuty);
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

    let brokerageUser;
    let brokerageCompany;

    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPrice);
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPrice);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPrice);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPrice);
    }
 

    OtmMock.findOne({uId : uId})
    .then((dateExist)=>{
        if(dateExist){
            //console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }

        const otmMock = new OtmMock({
            status:"COMPLETE", uId, createdBy, average_price: otmLastPrice, Quantity: otm_quantity, 
            Product, buyOrSell, order_timestamp: newTimeStamp,
            variety, validity, exchange, order_type: OrderType, symbol: otm, placed_by: "ninepointer", userId,
                algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
            lotMultipler, productChange, tradingAccount}, order_id, instrumentToken: otm_token, brokerage: brokerageCompany,
            tradeBy: createdBy, isRealTrade: false, amount: (Number(otm_quantity)*otmLastPrice), trade_time:trade_time,
            
        });

        //console.log("otmMock comapny", otmMock);
        otmMock.save().then(()=>{
            // res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        
    }).catch(err => {console.log( "fail")});

})

router.get("/readmockOtmtradecompany", (req, res)=>{
    OtmMock.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
         
            return res.status(200).send(data);
        }
    })
})

router.get("/userwiseOtm/:email", async(req, res)=>{
    
    const {email} = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let x = await OtmMock.aggregate([
        { $match: { trade_time : {$regex : todayDate} , status: "COMPLETE", userId: email} } ,
        { $group: { _id :{
            "otm" : "$symbol",
            "otm_token": "$instrumentToken"
        }, runningLots : { $sum : {$toDouble : "$Quantity"} } }} ,
        // { $project: { "_id" : 1, "otm_token" : 1, "trade_time": 1 } },
        { $sort:{ _id: 1 }}
            ])
            

        res.status(201).json(x);
        
})

module.exports = router;