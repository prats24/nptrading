const axios = require("axios")
const InstrumentTicksDataSchema = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const express = require("express");
const router = express.Router();
const ActiveInstruments = require("../models/Instruments/instrumentSchema");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const getKiteCred = require('../marketData/getKiteCred'); 
const nodemailer = require('nodemailer');
const dailyPnlDataController = require("../controllers/dailyPnlDataController")
const DailyPNLData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema")




  const getInstrumentTicksHistoryData = async () => {
    getKiteCred.getAccess().then(async (data)=>{
      // console.log("this is code ",data);
      console.log("inside function")
      const activeInstrument = await ActiveInstruments.find({status: "Active"});
      // console.log(activeInstrument)
      for(let i = 0; i < activeInstrument.length; i++){
        console.log("in 1st loop", (i+1));
        let {instrumentToken, createdOn, symbol} = activeInstrument[i];
        let date = createdOn.split(" ")[0];

        let tempData = date.split("-");
        let matchingDate = `${tempData[2]}-${tempData[1]}-${tempData[0]}`

        // console.log("instrumentToken", instrumentToken, activeInstrument[i])
        const historyData = await HistoryData.find({instrumentToken: instrumentToken, timestamp: {$regex:matchingDate}})
        // console.log("historyData", historyData)
        if(historyData.length === 0){
          console.log("in checking length's if", i+1)
          const api_key = data.getApiKey;
          const access_token = data.getAccessToken;
          let auth = 'token' + api_key + ':' + access_token;

          console.log(instrumentToken, matchingDate)
          
          const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/minute?from=${matchingDate}+09:15:00&to=${matchingDate}+15:30:00`;
          
      
          let authOptions = {
            headers: {
              'X-Kite-Version': '3',
              Authorization: auth,
            },
          };
      

          try{
            const response = await axios.get(url, authOptions);
            const instrumentticks = (response.data).data;
              console.log(instrumentticks.candles.length)
            let len = instrumentticks.candles.length;
            let instrumentticksdata;
            for(let j = len-1; j >= 0; j--){
              instrumentticksdata = JSON.parse(JSON.stringify(instrumentticks.candles[j]));
      
              let [timestamp, open, high, low, close, volume] = instrumentticksdata
              let runtime = new Date()
              let createdOn = `${String(runtime.getDate()).padStart(2, '0')}-${String(runtime.getMonth() + 1).padStart(2, '0')}-${(runtime.getFullYear())}`;
                  
              const instrumentticks_data = (new InstrumentTicksDataSchema({timestamp, symbol, instrumentToken, open, high, low, close, volume, createdOn }))

              console.log("this is instrument tick data", instrumentticks_data, typeof(instrumentticks_data));
              instrumentticks_data.save()
              .then(()=>{
                  console.log("data enter succesfully")
              }).catch((err)=> {
                    mailSender("Fail to enter data")
                // res.status(500).json({error:"Failed to enter data"});
                console.log("failed to enter data of order");
              })
              }

            setTimeout(async ()=>{

              const historyDataforLen = await HistoryData.find({timestamp: {$regex:matchingDate}})
              const dailyPnl = await DailyPNLData.find({timestamp: {$regex:matchingDate}})
              


              let length = historyDataforLen.length;
              mailSender(length);

              if(dailyPnl.length === 0){
                await dailyPnlDataController.dailyPnlCalculation(matchingDate);
              }

            },20000)


            
          } catch (err){
              return new Error(err);
          }
      
        } else{

          const historyDataforLen = await HistoryData.find({timestamp: {$regex:matchingDate}})

          let length = historyDataforLen.length;
          let message = length + " data already present"
          mailSender(message)
        }
    
      } 

    });
};

function mailSender(length){
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
            user: 'vvv201214@gmail.com',   //put your mail here
            pass: process.env.PASSWORD              //password here
          }
  });
  
  const mailOptions = { 
                from: 'vvv201214@gmail.com',       // sender address
                to: 'vvv201214@gmail.com, prateek@ninepointer.com',        // reciever address 
                subject: `History Data cronjob records inserted : ${length}`,  
                html: '<p>CronJob is done for history data, please check database</p>'// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err) 
      console.log("err in sending mail", err);
    else
      console.log("mail sent", info);
  });
}

module.exports = getInstrumentTicksHistoryData;