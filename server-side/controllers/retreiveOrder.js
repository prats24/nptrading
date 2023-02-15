const getKiteCred = require('../marketData/getKiteCred'); 
const axios = require("axios")
const RetreiveOrder = require("../models/TradeDetails/retreiveOrder");


exports.retreiveOrder = async () => {

    let length ;
    getKiteCred.getAccess().then(async (data)=>{
        
        let url = `https://api.kite.trade/orders`;
        const api_key = data.getApiKey; 
        const access_token = data.getAccessToken;
        let auth = 'token ' + api_key + ':' + access_token;
      
        let authOptions = {
          headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
          },
        };
      
          try{
    
            const response = await axios.get(url, authOptions);
            for (let tradeData of response.data.data) {
               // console.log("tradeData", tradeData)
            let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
                validity, exchange, exchange_timestamp, order_type, price, 
                filled_quantity, pending_quantity, cancelled_quantity, 
                guid, market_protection, disclosed_quantity, tradingsymbol, 
                placed_by, status_message, status_message_raw, 
                instrument_token, exchange_update_timestamp} = tradeData
    
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
    
                const tradeDetails = new RetreiveOrder({order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
                    validity, exchange, exchange_timestamp, order_type, price, 
                    filled_quantity, pending_quantity, cancelled_quantity, 
                    guid, market_protection, disclosed_quantity, tradingsymbol, 
                    placed_by, status_message, status_message_raw, 
                    instrument_token, exchange_update_timestamp});
        
              //  console.log("tradeDetails", tradeDetails)
                tradeDetails.save().then(async ()=>{
                    // await subscribeTokens();
                    // res.status(201).json({massage : "data enter succesfully"});
                }).catch((err)=> console.log(err, "failed to enter data"));
    
            }
      
          } catch (err){
           // console.log(err)
            // return res.status(422).json({error : "Failed to retreive data from api"});
        } 


    });



}