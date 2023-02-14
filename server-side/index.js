const express = require('express');
const nodeCron = require("node-cron");
const router = express.Router();
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const fetch = require('./marketData/placeOrder');
app.use(require("cookie-parser")());
const fetchData = require('./marketData/fetchToken');
const io = require('./marketData/socketio');
const {createNewTicker, disconnectTicker, getTicker, subscribeTokens, getTicks, onError, getMargins, onOrderUpdate} = require('./marketData/kiteTicker');
const getKiteCred = require('./marketData/getKiteCred'); 
const cronJobForHistoryData = require("./marketData/getinstrumenttickshistorydata");
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp")
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 100000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many request"
})
const { MongoClient } = require('mongodb');
// Apply the rate limiting middleware to all requests
// app.use(limiter)
app.use(mongoSanitize());
app.use(helmet());
app.use(xssClean());
app.use(hpp());

// issue fix --> if enviournment variable path is not work
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') })

getKiteCred.getAccess().then((data)=>{
  console.log(data)
  createNewTicker(data.getApiKey, data.getAccessToken);
});


io.on("connection", (socket) => {
  socket.on('hi', async (data) => {
    getKiteCred.getAccess().then(async (data)=>{

      let tokens = await fetchData(data.getApiKey, data.getAccessToken);
  
      subscribeTokens();
      getTicks(socket, tokens);
      onError();
      onOrderUpdate();

    });
  });
});

io.on('disconnection', () => {disconnectTicker()});



app.get('/api/v1/data', fetch);

let newCors = process.env.NODE_ENV === "production" ? "http://3.110.187.5/" : "http://localhost:3000"
app.use(cors({
  credentials:true,

  origin: "http://3.7.187.183/"  // staging
  // origin: "http://3.108.76.71/"  // production
    // origin: "http://localhost:3000"

}));

app.use(express.json({limit: "20kb"}));


app.use('/api/v1', require("./routes/OpenPositions/openPositionsAuth"))
app.use('/api/v1', require("./routes/expense/expenseAuth"))
app.use('/api/v1', require("./routes/expense/categoryAuth"))
app.use('/api/v1', require("./routes/setting/settingAuth"))
app.use('/api/v1', require("./routes/DailyPnlData/dailyPnlDataRoute"))
app.use('/api/v1', require("./marketData/livePrice"));
app.use('/api/v1', require("./marketData/Margin"));
app.use('/api/v1', require("./routes/user/userLogin"));
app.use('/api/v1', require('./routes/TradeData/getUserTrade'));
app.use('/api/v1', require('./routes/TradeData/getCompanyTrade'));
app.use('/api/v1', require('./routes/AlgoBox/exchangeMappingAuth'));
app.use('/api/v1', require('./routes/AlgoBox/instrumentAlgoAuth'));
app.use('/api/v1', require('./routes/AlgoBox/productMappingAuth'));
app.use('/api/v1', require('./routes/CronJobsRouter/getHistoryData'));
app.use('/api/v1', require('./routes/CronJobsRouter/historyTrade'));
app.use('/api/v1', require('./routes/AlgoBox/tradingAlgoAuth'));
app.use('/api/v1', require("./marketData/getRetrieveOrder"));
app.use('/api/v1', require('./marketData/placeOrder'));
app.use('/api/v1', require('./marketData/switchToRealTrade'));
app.use('/api/v1', require('./routes/instrument/instrumentAuth'));
app.use('/api/v1', require('./routes/TradingAccountAuth/accountAuth'));
app.use('/api/v1', require('./routes/TradingAccountAuth/brokerageAuth'));
app.use('/api/v1', require('./routes/TradingAccountAuth/parameterAuth'));
app.use('/api/v1', require('./routes/TradingAccountAuth/requestTokenAuth'));
app.use('/api/v1', require('./routes/user/userDetailAuth'));
app.use('/api/v1', require("./routes/user/everyoneRoleAuth"));
app.use('/api/v1', require("./routes/user/permissionAuth"));
app.use('/api/v1', require("./routes/mockTrade/mockTradeUserAuth"));
app.use('/api/v1', require("./routes/mockTrade/mockTradeCompanyAuth"));
app.use('/api/v1', require("./routes/mockTrade/otmMockTradeAuth"));
app.use('/api/v1', require("./models/TradeDetails/retreiveOrderAuth"));
require('./db/conn');


let date = new Date();
let weekDay = date.getDay();
  if(process.env.PROD){
    let date = new Date();
    let weekDay = date.getDay();
    if(weekDay > 0 && weekDay < 6){
        const job = nodeCron.schedule(`0 0 16 * * ${weekDay}`, cronJobForHistoryData);
    }

  }


//------------------------------------------------------------------------------------------
// async function backupDatabase(sourceUri, targetUri) {
//   try {
//     const sourceClient = await MongoClient.connect(sourceUri, { useUnifiedTopology: true });
//     const targetClient = await MongoClient.connect(targetUri, { useUnifiedTopology: true });

//     const sourceDb = sourceClient.db();
//     const targetDb = targetClient.db();

//     const collections = await sourceDb.collections();

//     for (const collection of collections) {
//       let i = 0;
//       const documents = await collection.find({}).toArray();
//       for (const document of documents) {
//         console.log(`Backing up document ${i++} from collection ${collection.collectionName}`);
//         await targetDb.collection(collection.collectionName).updateOne({ _id: document._id }, { $set: document }, { upsert: true });
//       }
//     }

//     sourceClient.close();
//     targetClient.close();
//   } catch (error) {
//     console.error(`Error while backing up the database: ${error.message}`);
//   }
// }

// const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"
// const targetUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";

// backupDatabase(sourceUri, targetUri);








const PORT = process.env.PORT;

const server = app.listen(PORT);
