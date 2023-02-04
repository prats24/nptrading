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


// Kite connect auto generate seesion

/*
var KiteConnect = require("kiteconnect").KiteConnect;

var kc = new KiteConnect({
  api_key: "nq0gipdzk0yexyko",
});

kc.generateSession("00l8N7KoiW0zXs8kR71EDW9S1Dxqy2Cb", "1v9mkp6uxu805ucjp4735ilsy61n8q6u")
  .then(function (response) {
    console.log("response of generate session", response)
    init();
  })
  .catch(function (err) {
    console.log("generate session error", err);
  });

function init() {
  // Fetch equity margins.
  // You can have other api calls here.
  kc.getMargins()
    .then(function (response) {
      // You got user's margin details.
      console.log("response of margin", response)
    })
    .catch(function (err) {
      console.log("error of margin", err)
    });
}


*/





getKiteCred.getAccess().then((data)=>{
  createNewTicker(data.getApiKey, data.getAccessToken);
});


io.on("connection", (socket) => {
  socket.on('hi', async (data) => {
    getKiteCred.getAccess().then(async (data)=>{

      let tokens = await fetchData(data.getApiKey, data.getAccessToken);
  
      subscribeTokens();
      getTicks(socket, tokens);
      onError();

    });
  });
});

io.on('disconnection', () => {disconnectTicker()});



app.get('/api/v1/data', fetch);

let newCors = process.env.NODE_ENV === "production" ? "http://3.110.187.5/" : "http://localhost:3000"
app.use(cors({
  credentials:true,

  // origin: "http://3.7.187.183/"  // staging
  // origin: "http://3.108.76.71/"  // production
   origin: "http://localhost:3000"

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
require('./db/conn');



  // if(process.env.PROD){
    let date = new Date();
    let weekDay = date.getDay();
    // if(weekDay > 0 && weekDay < 6){
    //     const job = nodeCron.schedule(`0 0 16 * * ${weekDay}`, cronJobForHistoryData);
    // }
    const job = nodeCron.schedule(`0 59 * * * *`, cronJobForHistoryData);

  // }

const PORT = process.env.PORT;

const server = app.listen(PORT);
