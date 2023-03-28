const axios = require('axios');
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");


const fetchData = async (getApiKey, getAccessToken) => {
  // const apiKey = await Account.find();
  // const accessToken = await RequestToken.find();
  // let getApiKey, getAccessToken;
  // let date = new Date();
  // let today = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`;
  // for(let elem of accessToken){
  //     for(let subElem of apiKey){
  //         if(elem.accountId === subElem.accountId && elem.generatedOn === today && elem.status === "Active" && subElem.status === "Active"){
  //             getAccessToken = elem.accessToken;
  //             getApiKey = subElem.apiKey
  //         }
  //     }
  //   }

    const resp = await Instrument.find();
    const resp2 = await InstrumentMapping.find({Status: "Active"})
    let ans = resp.filter((elem) => {
      return elem.status === 'Active'
    });
    
    let addUrl;
    ans.forEach((elem, index) => {
      if (index === 0) {
        addUrl = ('i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      } else {
        addUrl += ('&i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      }
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
    const res = await axios.get(url, authOptions);
    for (instrument in res.data.data) {
      arr.push(res.data.data[instrument].instrument_token);
    }

    return arr;

  } catch (err){
    return new Error(err);
  }  
};

module.exports = fetchData;