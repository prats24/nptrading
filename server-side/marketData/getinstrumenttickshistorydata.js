const axios = require("axios")
const InstrumentTicksDataSchema = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const express = require("express");
const router = express.Router();
const ActiveInstruments = require("../models/Instruments/instrumentSchema");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const getKiteCred = require('../marketData/getKiteCred'); 
const nodemailer = require('nodemailer');
const dailyPnlDataController = require("../controllers/dailyPnlDataController")
const traderwiseDailyPnlController = require("../controllers/traderwiseDailyPnlController")
const DailyPNLData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema")
const TraderDailyPnlData = require("../models/InstrumentHistoricalData/TraderDailyPnlDataSchema");
const dbBackup = require("../Backup/mongoDbBackUp")
const RetreiveOrder = require("../controllers/retreiveOrder")
const MockTradeDetails = require("../models/mock-trade/mockTradeCompanySchema");







const getInstrumentTicksHistoryData = async () => {
  getKiteCred.getAccess().then(async (data)=>{
    let date = new Date();
    let matchingDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let instrumentDetail = await MockTradeDetails.aggregate([
      {
        $match: {
          trade_time: {
            $regex: matchingDate,
          },
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
          },
          
        },
      },
      
    ])
    // let matchingDate;
    for(let i = 0; i < instrumentDetail.length; i++){
      let {instrumentToken, symbol} = instrumentDetail[i]._id;
      // let date = createdOn.split(" ")[0];

      // let tempData = date.split("-");
      // matchingDate = `${tempData[2]}-${tempData[1]}-${tempData[0]}`

      const historyData = await HistoryData.find({instrumentToken: instrumentToken, timestamp: {$regex:matchingDate}})
      if(historyData.length === 0){
        const api_key = data.getApiKey;
        const access_token = data.getAccessToken;
        let auth = 'token' + api_key + ':' + access_token;

        
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
          let len = instrumentticks.candles.length;
          let instrumentticksdata;
          for(let j = len-1; j >= 0; j--){
            instrumentticksdata = JSON.parse(JSON.stringify(instrumentticks.candles[j]));
    
            let [timestamp, open, high, low, close, volume] = instrumentticksdata
            let runtime = new Date()
            let createdOn = `${String(runtime.getDate()).padStart(2, '0')}-${String(runtime.getMonth() + 1).padStart(2, '0')}-${(runtime.getFullYear())}`;
                
            const instrumentticks_data = (new InstrumentTicksDataSchema({timestamp, symbol, instrumentToken, open, high, low, close, volume, createdOn }))

            instrumentticks_data.save()
            .then(()=>{
              console.log("saving", symbol, open)
            }).catch((err)=> {
                  mailSender("Fail to enter data")
              // res.status(500).json({error:"Failed to enter data"});
            })
          }

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

    setTimeout(async ()=>{

      const historyDataforLen = await HistoryData.find({timestamp: {$regex:matchingDate}})
      const dailyPnl = await DailyPNLData.find({timestamp: {$regex:matchingDate}})
      const traderDailyPnl = await TraderDailyPnlData.find({timestamp: {$regex:matchingDate}})
      
      let length = historyDataforLen.length;
      mailSender(length);

      if(dailyPnl.length === 0){
        await dailyPnlDataController.dailyPnlCalculation(matchingDate);
      }

      if(traderDailyPnl.length === 0){
        await traderwiseDailyPnlController.traderDailyPnlCalculation(matchingDate);
      }

      const sourceUri = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority"
      // const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"
      const targetUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";

      // await dbBackup.backupDatabase(sourceUri, targetUri);
      await RetreiveOrder.retreiveOrder()


    },50000)

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
      console.log("err in sending mail");
    else
      console.log("mail sent");
  });
}

module.exports = getInstrumentTicksHistoryData;