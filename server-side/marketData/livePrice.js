const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../db/conn");
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");


router.get("/getliveprice", async (req, res)=>{

  const apiKey = await Account.find();
  const accessToken = await RequestToken.find();
  console.log(accessToken);
  let getApiKey, getAccessToken;
  let date = new Date();
  let today = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  for(let elem of accessToken){
      for(let subElem of apiKey){
          if(elem.accountId === subElem.accountId && elem.generatedOn === today && elem.status === "Active" && subElem.status === "Active"){
              getAccessToken = elem.accessToken;
              getApiKey = subElem.apiKey
          }
      }
    }



    console.log("in live price file", getAccessToken, getApiKey);

    const resp = await Instrument.find();
    let ans = resp.filter((elem) => {
      return elem.status === 'Active'
    });
    
    ans.forEach((elem, index) => {
      if (index === 0) {
        addUrl = 'i=' + elem.exchange + ':' + elem.symbol;
      } else {
        addUrl += '&i=' + elem.exchange + ':' + elem.symbol;
      }
    });

  
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
        for (instrument in response.data.data) {
            let obj = {};
            obj.last_price = response.data.data[instrument].last_price;
            obj.instrument_token = response.data.data[instrument].instrument_token;
            obj.average_price = response.data.data[instrument].ohlc.close;
            obj.timestamp = response.data.data[instrument].timestamp
            arr.push(obj);
            console.log("ohcl",response.data.data[instrument].ohlc.close)
        }
        return res.status(201).send((arr));
  
      } catch (err){
        return res.status(422).json({error : "Failed to send data"});
    }  
  
})

module.exports = router;

