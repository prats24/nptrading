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
const {createNewTicker, disconnectTicker, getTicker, subscribeTokens, getTicks, onError, getMargins} = require('./marketData/kiteTicker');
const getKiteCred = require('./marketData/getKiteCred'); 
const cronJobForHistoryData = require("./marketData/getinstrumenttickshistorydata");
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp")
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	max: 5000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many request"
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
app.use(mongoSanitize());
app.use(helmet());
app.use(xssClean());
app.use(hpp());

// issue fix --> if enviournment variable path is not work
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') })



// dotenv.config({ path: './config.env' });

getKiteCred.getAccess().then((data)=>{
  // console.log("this is code ",data);
  createNewTicker(data.getApiKey, data.getAccessToken);
});


io.on("connection", (socket) => {
  console.log('client socket is' + socket.id);
  // socket1 = socket;
  socket.on('hi', async (data) => {
    // eventEmitOnError = data;
    getKiteCred.getAccess().then(async (data)=>{
      console.log(data);

      let tokens = await fetchData(data.getApiKey, data.getAccessToken);
      // console.log('tokens index', tokens);
  
      subscribeTokens();
      getTicks(socket, tokens);
      onError();

    });
  });
});

io.on('disconnection', () => {disconnectTicker()});



// console.log(kiteConnect);
// app.get('/api/v1/ws', kiteConnect.parameters);
app.get('/api/v1/data', fetch);

// app.get('/ws', kiteConnect);
// app.get('/data', fetch);
let newCors = process.env.NODE_ENV === "production" ? "http://3.110.187.5/" : "http://localhost:3000"
app.use(cors({
  credentials:true,

  origin: "http://3.7.187.183/"  // staging
  // origin: "http://3.108.76.71/"  // production
  //  origin: "http://localhost:3000"

}));

app.use(express.json({limit: "20kb"}));


//Update 
// app.use('/api/v1', require("./routes/TradeData/getCompanyTrade"));
//Update
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
require('./db/conn');

// process.on('unhandledRejection', (err) => {
//   console.log(err.name, err.message);
//   console.log('UNHANDLED REJECTION! Shutting Down...');
//   server.close(() => {
//     process.exit(1);
//   });
// });

  if(process.env.PROD){
    let date = new Date();
    let weekDay = date.getDay();
    if(weekDay > 0 && weekDay < 6){
        // const job = nodeCron.schedule(`0 5 10 * * ${weekDay}`, cronJobForHistoryData);
        const job = nodeCron.schedule(`0 0 16 * * ${weekDay}`, cronJobForHistoryData);
    }
  }



// app.use(require("./utils/errorHandler"));

const PORT = process.env.PORT;

const server = app.listen(PORT);
