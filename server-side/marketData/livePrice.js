const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../db/conn");
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
const ContestInstrument = require("../models/Instruments/contestInstrument");


router.get("/getliveprice", async (req, res)=>{

  const apiKey = await Account.find({status: "Active"});
  const accessToken = await RequestToken.find({status: "Active"});
  let getApiKey, getAccessToken;
  let date = new Date();
  let today = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`;
  for(let elem of accessToken){
      for(let subElem of apiKey){
          if(elem.accountId === subElem.accountId && elem.generatedOn === today ){
              getAccessToken = elem.accessToken;
              getApiKey = subElem.apiKey
          }
      }
    }




    const ans = await Instrument.find({status: "Active"});
    const contestInstrument = await ContestInstrument.find({status: "Active"});
    const resp2 = await InstrumentMapping.find({Status: "Active"})
    // let ans = resp.filter((elem) => {
    //   return elem.status === 'Active'
    // });
    
    let addUrl;
    ans.forEach((elem, index) => {
      if (index === 0) {
        addUrl = ('i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      } else {
        addUrl += ('&i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      }
    });

    contestInstrument.forEach((elem, index) => {
      // if (index === 0) {
      //   addUrl = ('i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      // } else {
      // }
      addUrl += ('&i=' + elem.exchange + ':' + elem.symbol);

    });

    // resp2.forEach((elem, index) => {
    //   // console.log(addUrl)
    //   addUrl += ('&i=' + elem.incomingInstrumentExchange + ':' + elem.InstrumentNameIncoming + '&i=' + elem.outgoingInstrumentExchange + ':' + elem.InstrumentNameOutgoing);
    // });

    let url = `https://api.kite.trade/quote?${addUrl}`;
    const api_key = getApiKey; 
    const access_token = getAccessToken;
    let auth = 'token' + api_key + ':' + access_token;
  
    let authOptions = {
      headers: {
        'X-Kite-Version': '3',
        Authorization: auth,
      },
    };
  
    let arr = [];
      try{

        const response = await axios.get(url, authOptions);
        for (let instrument in response.data.data) {
            let obj = {};
            obj.last_price = response.data.data[instrument].last_price;
            obj.instrument_token = response.data.data[instrument].instrument_token;
            obj.average_price = response.data.data[instrument].ohlc.close;
            obj.timestamp = response.data.data[instrument].timestamp
            arr.push(obj);
        }
        return res.status(201).send((arr));
  
      } catch (err){
        console.log(err)
        return res.status(422).json({error : "Failed to send data"});
    }  
  
})

module.exports = router;

