const kiteTicker = require('kiteconnect').KiteTicker;
const fetchData = require('./fetchToken');
const getKiteCred = require('./getKiteCred'); 
const RetreiveOrder = require("../models/TradeDetails/retreiveOrder")
const RetreiveTrade = require("../models/TradeDetails/retireivingTrade")
const io = require('../marketData/socketio');



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

const unSubscribeTokens = async(token) => {
    let tokens = [];
    tokens.push(token)
   let x =  ticker.unsubscribe(tokens);
  //  console.log("unsubscribed token", x, tokens);
}

const getTicks = (socket, tokens) => {
    ticker.on('ticks', async (ticks) => {
      // if(ticks.length == tokens.length){
        // console.log('sending ticks', ticks);
        try{
          for(let tick of ticks){
            // console.log(tick.instrument_token)
            let ticksArr = []
            ticksArr.push(tick);
            io.to(`instrument ${tick.instrument_token}`).emit('tick', ticksArr);
            // io.to(`instrument`).emit('tick', tick);
            // console.log("socket rooms", socket.rooms)
            // console.log("sending ticks for", tick.instrument_token)
          }

        } catch( error){
          console.log(error)
        }

        // socket.emit('tick', ticks); 
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
//       async function orderUpdateFunc() {
//         // console.log("updated order", orderUpdate)
//       }



const getTicker = () => ticker;
module.exports = {createNewTicker, disconnectTicker, subscribeTokens, getTicker, getTicks, onError, unSubscribeTokens, onOrderUpdate, subscribeSingleToken };




