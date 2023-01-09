const axios = require("axios")
const InstrumentTicksDataSchema = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const express = require("express");
const router = express.Router();

  const getInstrumentTicksHistoryData = async (apiKey, accessToken) => {
  
  const api_key = apiKey;
  const access_token = accessToken;
  let auth = 'token' + api_key + ':' + access_token;
  let instrumenttoken = '12732674';

  let date = '2023-01-09'
  let symbol = 'NIFTY2311218200PE'
  let runtime = new Date()
  let createdOn = `${String(runtime.getDate()).padStart(2, '0')}-${String(runtime.getMonth() + 1).padStart(2, '0')}-${(runtime.getFullYear())} ${String(runtime.getHours()).padStart(2, '0')}:${String(runtime.getMinutes()).padStart(2, '0')}:${String(runtime.getSeconds()).padStart(2, '0')}`
  const url = `https://api.kite.trade/instruments/historical/${instrumenttoken}/minute?from=${date}+09:15:00&to=${date}+15:15:00`;
  

  let authOptions = {
    headers: {
      'X-Kite-Version': '3',
      Authorization: auth,
    },
  };

  try{
    const response = await axios.get(url, authOptions);
    // console.log("its json data", JSON.stringify(res.data));
    const instrumentticks = (response.data).data;
    console.log("in retrieve order", instrumentticks.candles);
    let len = instrumentticks.candles.length;
    console.log(len)
    let instrumentticksdata;
    for(let i = len-1; i >= 0; i--){
      instrumentticksdata = JSON.parse(JSON.stringify(instrumentticks.candles[i]));

    console.log("Instrument Ticks data", instrumentticksdata);
    let [timestamp, open, high, low, close, volume] = instrumentticksdata
          
              const instrumentticks_data = (new InstrumentTicksDataSchema({timestamp, symbol, instrumenttoken, open, high, low, close, volume, createdOn }))
  
              console.log("this is instrument tick data", instrumentticks_data, typeof(instrumentticks_data));
              instrumentticks_data.save()
              .then(()=>{
                  console.log("data enter succesfully")
              }).catch((err)=> {
                // res.status(500).json({error:"Failed to enter data"});
                console.log("failed to enter data of order");
              })
              console.log("# Data Saved"+i)
            }
          
        console.log("Data Saved");  
  } catch (err){
      return new Error(err);
  }
  
};

module.exports = getInstrumentTicksHistoryData;