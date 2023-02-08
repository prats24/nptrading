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


// Kite connect auto generate seesion

/*
var KiteConnect = require("kiteconnect").KiteConnect;

var kc = new KiteConnect({
  api_key: "nq0gipdzk0yexyko",
});

kc.generateSession("tqYJMZM0ohSOFCqCqPN8on9v2jZVrhFq", "1v9mkp6uxu805ucjp4735ilsy61n8q6u")
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



  if(process.env.PROD){
    let date = new Date();
    let weekDay = date.getDay();
    if(weekDay > 0 && weekDay < 6){
        const job = nodeCron.schedule(`0 0 16 * * ${weekDay}`, cronJobForHistoryData);
    }

  }


/*

    // const destinationUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority";
    const sourceUri = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority";
    const destinationUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";
    // const destinationUri = "mongodb+srv://forStagingPurpose:ninepointer@cluster0.snsb6wx.mongodb.net/?retryWrites=true&w=majority";
    let client, destinationClient;
    async function backup() {
    try {
        // Connect to the source cluster
        client = await MongoClient.connect(sourceUri, { useNewUrlParser: true });
        // console.log(client); 

        // Get the list of collections in the source cluster
        const collections = await client.db().collections();

        // console.log(collections);
        
        // Create a new client for the destination cluster
        destinationClient = await MongoClient.connect(destinationUri, { useNewUrlParser: true });
        const destCollections = await destinationClient.db().collections();

        destCollections.forEach(async collection => {
            if(await client.db().listCollections({name: collection.s.namespace.collection}).hasNext()){
                console.log('dropping' + collection.s.namespace.collection);
                await destinationClient.db().collection(collection.s.namespace.collection).drop();
            }
        });
        

        // Iterate through the collections and copy the data
        for (const collection of collections) {
        // Get the data from the source collection
        const cursor = await collection.find({});
        //   console.log(cursor);
        //   console.log('s is', collection.s.namespace.collection);
        // Insert the data into the destination collection
        if(await cursor.count() > 0){
        await destinationClient.db().collection(collection.s.namespace.collection).insertMany(await cursor.toArray(),{ ordered: false });
            }
        }
        console.log('Backup completed successfully');
    } catch (err) {
        console.log('to err is to err')
        console.error(err);
    } finally {
        if(client) client.close();
        if(destinationClient) destinationClient.close();
    }
    }

    backup().then(()=>{
        console.log('ok');
    });


*/



const PORT = process.env.PORT;

const server = app.listen(PORT);
