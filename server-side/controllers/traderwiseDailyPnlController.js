//This controller is for updating the daily pnl table with symbol wise pnl and overall daily pnl

const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const TraderDailyPnlData = require("../models/InstrumentHistoricalData/TraderDailyPnlDataSchema");
const MockTradeData = require("../models/mock-trade/mockTradeUserSchema");
const TraderDetails = require("../models/User/userDetailSchema");

exports.traderDailyPnlCalculation = async(date) => {
  //Extracting timestamp from the instrument history data
  //let date = '2023-01-09';
  const traderdailyPnl = await TraderDailyPnlData.find({timestamp: {$regex:date}})
  console.log("Trader Daily PNL Table Records for Today: "+traderdailyPnl.length);
  const traderDetails = await TraderDetails.find({status:'Active'}).select("name email status");
  console.log("Trader Details Table Length: "+traderDetails.length)

  if(traderdailyPnl.length === 0){

    const instrumentData = await HistoryInstrumentData.find({timestamp : {$gte: `${date}T00:00:00+0530`,$lte:`${date}T23:59:59+0530`}}).select("timestamp symbol open").sort({timestamp: 1})
    console.log("History Instrument Data: "+instrumentData);

    //Extracting mock trade data for the particular date
    const mockTradeData = await MockTradeData.find({trade_time : {$gte: `${date} 00:00:00`,$lte:`${date} 23:59:59`}}).select("trade_time symbol amount userId Quantity buyOrSell algoBox brokerage createdBy status").sort({trade_time : 1})

    console.log("Mock Trade Data Length: "+mockTradeData.length);

   // const traderDetails = await MockTradeData.find({trade_time : {$gte: `${date} 00:00:00`,$lte:`${date} 23:59:59`}}).select("trade_time symbol amount userId Quantity buyOrSell algoBox brokerage createdBy status").sort({trade_time : 1})
    
    traderDetails.map(async(td)=>{
        console.log("Trader: "+td.name)
        instrumentData.map(async(elem)=>{
            //Converting the date time format
            let filteringTimestamp = elem.timestamp.split("T")[0] + " " + elem.timestamp.split("T")[1].split("+")[0]
            //console.log("Filtering Date: "+filteringTimestamp);
            
            let pnlTimeTradeData = mockTradeData.filter((e)=> {
                //console.log("Compare Time: ",Date(filteringTimestamp),Date(e.trade_time))
                //console.log(elem.open,e.Quantity,elem.symbol,e.symbol,e.status,e.userId,td.email);
                return filteringTimestamp >= e.trade_time && elem.symbol == e.symbol && e.status == "COMPLETE" && e.userId == td.email
                
            })
            //console.log("PNL Trade Data Length: "+pnlTimeTradeData.length)
            //console.log("PNL Time Trade Data Length: "+pnlTimeTradeData.length);
            if(pnlTimeTradeData.length !== 0){

                let totalAmount = 0;
                let totalRunningLots = 0;
                let totalTrades = pnlTimeTradeData.length;
                
          
                pnlTimeTradeData.map((element)=>{
                    totalAmount += element.amount
                    //console.log("Amount: "+element.amount)
                    totalRunningLots += Number(-element.Quantity)
                    //console.log("Quantity: "+element.Quantity)
                })
                
                //console.log("Total Running Lots: "+totalRunningLots)
          
                let finalPnlTimeData = totalAmount + (totalRunningLots*elem.open)
                //console.log("Final PNL Amount: "+finalPnlTimeData);
                let traderName = td.name
                let userId = td.email
                //console.log("Data: "+filteringTimestamp,elem.symbol,finalPnlTimeData,totalAmount,totalRunningLots)
                //console.log(finalPnlTimeData,elem.open,totalAmount,totalRunningLots)
          
                let x = await TraderDailyPnlData.create({symbol:elem.symbol,timestamp:filteringTimestamp,calculatedGpnl:-finalPnlTimeData,noOfTrades:totalTrades,traderName:traderName,userId:userId}, function (err, TraderDailyPnlData){
                    if (err) return console.log(err);
                     console.log("Data Saved for :"+td.name)
                });
              
          
                //console.log(x);
          
          
               //console.log("PNL Time Trade Data: "+pnlTimeTradeData)

            }
         
        })

    })
}
}

exports.getTraderDailyPnlData = async(req,res,next) => {
    const {selectDate,traderName} = req.params;
    console.log("Select Date in the API: "+selectDate,traderName)
    const pipeline = [
        {$match: {
          timestamp : {$gte : `${selectDate} 00:00:00`, $lte : `${selectDate} 23:59:59`},
          traderName: traderName
          // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
        }
        },
        {
          $project: {
            date: {
                $dateToString: {
                    format: "%Y-%m-%d %H:%M:%S",
                    date: {
                        $convert: {
                            input: "$timestamp",
                            to: "date"
                        }
                    }
                }
            },
            calculatedGpnl: 1,
            noOfTrades: 1,
            traderName: 1,
        }
        },
        {
          $group: {
            _id: {date : "$date", traderName : "$traderName"},
            
            pnl: {
              $sum: "$calculatedGpnl"
            },
            trades: {
              $sum: "$noOfTrades"
            },
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
         ]
       
       let x = await TraderDailyPnlData.aggregate(pipeline)
    
       res.status(201).json(x);
}

exports.deleteDuplicateData = async(req,res,next) => {
      let cursor = await TraderDailyPnlData.aggregate([
       {$group: {
         _id: { timetsamp: "$timestamp", symbol: "$symbol" },
         dups: { $addToSet: "$_id" },
         count: { "$sum": 1 }
       }},
       { $match: { count: { "$gt": 1 } } }
     ])
     
     let i = 0;
     cursor.forEach(async (doc, index)=>{
         // doc.dups[0].shift()
          console.log(doc.dups[0], i++)
        //  await TraderDailyPnlData.deleteMany({_id:{$in:doc.dups[0]}})
         console.log("deleted")
     })

}

exports.getstoplossstopprofitpnl = async(req,res,next) => {
  //const {stoploss,stopprofit} = req.params;
  //console.log("Stop Loss & Stop Profit: "+stoploss,stopprofit)
  const pipeline = [
    {
      $match: {
        timestamp: {
          $regex: "2023-01-31",
        },
        traderName: "Praveen K",
      },
    },
    {
      $group: {
        _id: {
          traderName: "$traderName",
          timestamp: "$timestamp",
        },
        gpnl: {
          $sum: "$calculatedGpnl",
        },
      },
    },
    {
      $project: {
        _id: 0,
        traderName: "$_id.traderName",
        timestamp: "$_id.timestamp",
        gpnl: "$gpnl",
        absDiff: {
          $min: [
            { $abs: { $subtract: [ "$gpnl", -50000 ] } },
            { $abs: { $subtract: [ "$gpnl", 100000 ] } }
          ]
        }
      }
    },
    {
      $sort: {
        absDiff: 1,
        timestamp: 1
      }
    },
    {
      $limit: 1
    }
  ]
  
      
      let x = await TraderDailyPnlData.aggregate(pipeline)
  
      res.status(201).json(x);
  }

  exports.getstoplosspnl = async(req,res,next) => {
    console.log("Inside stoploss trader pnl api")
    let {stoploss} = req.params
    
    let pipeline = [
        {
          $match: {
            //traderName: "Praveen K",
            calculatedGpnl: {
              $lte: -Number(`${stoploss}`),
            },
          },
        },
        {
          $addFields: {
            timestamp: {
              $toDate: "$timestamp",
            },
          },
        },
        {
          $group: {
            _id: {
              traderName: "$traderName",
              day: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$timestamp",
                },
              },
            },
            stopLossTimestamp: {
              $min: "$timestamp",
            },
            calculatedGpnl: {
              $first: "$calculatedGpnl",
            },
          },
        },
        {
          $sort: {
            "_id.day": 1,
            stopLossTimestamp: 1,
          },
        },
        {
          $project: {
            _id: 0,
            traderName: "$_id.traderName",
            day: "$_id.day",
            stopLossTimestamp: 1,
            calculatedGpnl: 1,
          },
        },
      ]

    let x = await TraderDailyPnlData.aggregate(pipeline)

        res.status(201).json(x);
        
}



