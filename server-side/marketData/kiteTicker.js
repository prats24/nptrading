const kiteTicker = require('kiteconnect').KiteTicker;
const fetchData = require('./fetchToken');
const getKiteCred = require('./getKiteCred'); 
const RetreiveOrder = require("../models/TradeDetails/retreiveOrder")
// const RetreiveTrade = require("../models/TradeDetails/retireivingTrade")
const io = require('../marketData/socketio');
const client = require("./redisClient");



let ticker;
const createNewTicker = (api_key, access_token) => {
    ticker = new kiteTicker({
        api_key,
        access_token 
    });
   
    ticker.connect();
    ticker.autoReconnect(true, 10000000000, 5);
    return ticker;    
}

const disconnectTicker = () => {
    console.log('disconnecting ticker');
    ticker.disconnect();
}

const subscribeTokens = async() => {
  getKiteCred.getAccess().then(async (data)=>{
    let tokens = await fetchData(data.getApiKey, data.getAccessToken);
    ticker.subscribe(tokens);
  });
}

const subscribeSingleToken = async(instrumentToken) => {
  ticker.subscribe(instrumentToken);
}

// const unSubscribeSingleToken = async(instrumentToken) => {
//   ticker.unsubscribe(instrumentToken);
// }

const unSubscribeTokens = async(token) => {
    let tokens = [];
    tokens.push(token)
   let x =  ticker.unsubscribe(tokens);
  //  console.log("unsubscribed token", x, tokens);
}

const getTicks = (socket, tokens) => {

  ticker.on('ticks', async (ticks) => {

    let userId = await client.get(socket.id)
    let instruments = await client.LRANGE(userId, 0, -1)
    let instrumentTokenArr = new Set(instruments); // create a Set of tokenArray elements
    let filteredTicks = ticks.filter(tick => instrumentTokenArr.has((tick.instrument_token).toString()));

    console.log(filteredTicks);
    socket.emit('tick', ticks);
    io.to(`${userId}`).emit('tick-room', filteredTicks);
    
    // if(ticks.length == tokens.length){
      // client.on('error', function(err) {
      //   console.log('Redis error: ' + err);
      // });
      
      // // Add a reconnect listener to the client to log any reconnections
      // client.on('reconnect', function() {
      //   console.log('Redis client reconnected');
      // });
      
      // console.log("client", client)
      
      // try{
      //   for(let tick of ticks){
      //     let ticksArr = []
      //     ticksArr.push(tick);
      //     // console.log(tick)
      //     socket.emit('check', true)
      //     // io.to(`instrument ${tick.instrument_token}`).emit('tick-room1', ticksArr);
      //   }

      // } catch( error){
      //   console.log(error)
      // }

  });
}

const onError = ()=>{
    ticker.on('error', (error)=>{
      // console.log(error);
    });
}

const onOrderUpdate = ()=>{
  // ticker.on("order_update", onTrade)
  ticker.on('order_update', (orderUpdate)=>{
    let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
      validity, exchange, exchange_timestamp, order_type, price, 
      filled_quantity, pending_quantity, cancelled_quantity, 
      guid, market_protection, disclosed_quantity, tradingsymbol, 
      placed_by, status_message, status_message_raw, 
      instrument_token, exchange_update_timestamp, account_id} = orderUpdate

      if(!status_message){
          status_message = "null"
      }
      if(!status_message_raw){
          status_message_raw = "null"
      }
      if(!exchange_timestamp){
          exchange_timestamp = "null"
      }
      if(!exchange_order_id){
          exchange_order_id = "null"
      }
      if(!exchange_update_timestamp){
          exchange_update_timestamp = "null"
      }

      if(status === "COMPLETE" || status === "REJECTED"){
        RetreiveOrder.findOne({order_id : order_id, guid: guid})
        .then((dataExist)=>{
          if(dataExist ){
              return;
          }

          const retreiveOrder = new RetreiveOrder({order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
              validity, exchange, exchange_timestamp, order_type, price, 
              filled_quantity, pending_quantity, cancelled_quantity, 
              guid, market_protection, disclosed_quantity, tradingsymbol, 
              placed_by, status_message, status_message_raw, 
              instrument_token, exchange_update_timestamp, account_id});
              
          // console.log("retreiveOrder", retreiveOrder._id, retreiveOrder.status, retreiveOrder.order_id)
          retreiveOrder.save().then(async ()=>{
              // await subscribeTokens();
              // res.status(201).json({massage : "data enter succesfully"});
          }).catch((err)=> console.log( "failed to enter data"));
          
    

        }).catch(err => {console.log("fail company live data saving")});
      }

  });
}


const getTicker = () => ticker;
module.exports = {createNewTicker, disconnectTicker, subscribeTokens, getTicker, getTicks, onError, unSubscribeTokens, onOrderUpdate, subscribeSingleToken };




