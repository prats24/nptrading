const axios = require('axios');
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
const StockIndex = require("../models/StockIndex/stockIndexSchema");


const fetchData = async () => {



    // let addUrl;
    // resp.forEach((elem, index) => {
    //   if (index === 0) {
    //     addUrl = ('i=' + elem.exchange + ':' + elem.symbol );
    //   } else {
    //     addUrl += ('&i=' + elem.exchange + ':' + elem.symbol );
    //   }
    // });

    // index.forEach((elem, index) => {
      // if(index !== 1){
      //   addUrl += ('&i=' + elem.exchange + ':' + elem.instrumentSymbol );
      // }
    // })
    // resp2.forEach((elem, index) => {
    //   // console.log(addUrl)
    //   addUrl += ('&i=' + elem.incomingInstrumentExchange + ':' + elem.InstrumentNameIncoming + '&i=' + elem.outgoingInstrumentExchange + ':' + elem.InstrumentNameOutgoing);
    // });

    // let url = `https://api.kite.trade/quote?${addUrl}`;
    // const api_key = getApiKey; 
    // const access_token = getAccessToken;
    // let auth = 'token' + api_key + ':' + access_token;
  
    // let authOptions = {
    //   headers: {
    //     'X-Kite-Version': '3',
    //     Authorization: auth,
    //   },
    // };


  // let arr = [];
  try{
    // const res = await axios.get(url, authOptions);
    // for (instrument in res.data.data) {
    //   arr.push(res.data.data[instrument].instrument_token);
    // }
    const resp = await Instrument.find({status: "Active"});
    const index = await StockIndex.find({status: "Active"})
    // const resp2 = await InstrumentMapping.find({Status: "Active"})


    let tokens = [];
    resp.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
    index.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
  
    // console.log("tokens", tokens);
    // console.log("arr", arr);

    return tokens

  //   return arr;

  } catch (err){
    return new Error(err);
  } 

};

module.exports = fetchData;