//This controller is for updating the daily pnl table with symbol wise pnl and overall daily pnl

const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const DailyPnlData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema");
const MockTradeData = require("../models/mock-trade/mockTradeCompanySchema");

exports.dailyPnlCalculation = async(req,res,next) => {
  //Extracting timestamp from the instrument history data
  let date = '2023-01-09';
  const instrumentData = await HistoryInstrumentData.find({timestamp : {$gte: `${date}T00:00:00+0530`,$lte:`${date}T23:59:59+0530`}}).select("timestamp symbol open").sort({timestamp: 1})
  console.log("History Instrument Data: "+instrumentData);

  //Extracting mock trade data for the particular date
  const mockTradeData = await MockTradeData.find({trade_time : {$gte: `${date} 00:00:00`,$lte:`${date} 23:59:59`}}).select("trade_time symbol amount Quantity buyOrSell algoBox brokerage createdBy").sort({trade_time : 1})
//   console.log("Mock Trade Data: "+mockTradeData);

  instrumentData.map(async(elem)=>{
    //Converting the date time format
    let filteringTimestamp = elem.timestamp.split("T")[0] + " " + elem.timestamp.split("T")[1].split("+")[0]
    //console.log("Filtering Date: "+filteringTimestamp);
    
    let pnlTimeTradeData = mockTradeData.filter((e)=> {
        //console.log("Compare Time: ",Date(filteringTimestamp),Date(e.trade_time))
        console.log(elem.open,e.Quantity,elem.symbol,e.symbol);
        return filteringTimestamp >= e.trade_time && elem.symbol == e.symbol && elem.status == "COMPLETE"
        
    })
    // console.log(pnlTimeTradeData.length);

    let totalAmount = 0;
    let totalRunningLots = 0;
    let totalTrades = pnlTimeTradeData.length;
    let totalTraders = 0;

    let uniqueTraders = new Set(); // use set to store unique traders

    pnlTimeTradeData.forEach(trade => {
    uniqueTraders.add(trade.createdBy);
    });

    totalTraders = uniqueTraders.size;

    pnlTimeTradeData.map((element)=>{
        totalAmount += element.amount
        console.log("Amount: "+element.amount)
        totalRunningLots += Number(-element.Quantity)
        console.log("Quantity: "+element.Quantity)

    })
    
    //console.log("Total Running Lots: "+totalRunningLots)

    let finalPnlTimeData = totalAmount + (totalRunningLots*elem.open)
    //console.log("Data: "+filteringTimestamp,elem.symbol,finalPnlTimeData,totalAmount,totalRunningLots)
    //console.log(finalPnlTimeData,elem.open,totalAmount,totalRunningLots)

    let x = await DailyPnlData.create({symbol:elem.symbol,timestamp:filteringTimestamp,calculatedGpnl:-finalPnlTimeData,noOfTrades:totalTrades,noOfTraders:totalTraders}, function (err, DailyPnlData){
        if (err) return console.log(err);
        // saved!
     });

    //  console.log(x);


    // console.log("PNL Time Trade Data: "+pnlTimeTradeData)
  })
}

exports.getDailyPnlData = async(req,res,next) => {
const {selectDate} = req.params;
console.log("Select Date in the API: "+selectDate)
const pipeline = [
  {$match: {
    timestamp : {$gte : `${selectDate} 00:00:00`, $lte : `${selectDate} 23:59:59`}
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
      noOfTraders: 1
  }
  },
  {
    $group: {
      _id: "$date",
      pnl: {
        $sum: "$calculatedGpnl"
      },
      trades: {
        $sum: "$noOfTrades"
      },
      traders: {
        $sum: "$noOfTraders"
      }
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
   ]
   
   let x = await DailyPnlData.aggregate(pipeline)

   res.status(201).json(x);
}