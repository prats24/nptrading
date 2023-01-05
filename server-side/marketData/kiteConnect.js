

    
//         origin: newCors,
//         //  origin: "http://3.110.187.5/",
    
//         methods: ['GET', 'POST', 'PATCH'],
//       },
//     });
//     // let socket1 = '';
//     io.on("connection", (socket) => {
//       console.log('client socket is' + socket.id);
//       // socket1 = socket;
//       socket.on('hi', (data) => {
//         eventEmitOnError = data;
//         // console.log(data);
//         parameters(io, socket, ticker);
//       });
    
//     });    
//   },4000)


// //   return ticker;
// // }

// // let ticker = kiteTickerFunc();
// // console.log("ticker", ticker);

// // console.log("ticker", ticker)
// // let token;
// async function tikerFunc(){
//   // token = await fetchData(getApiKey, getAccessToken);

//   //   var items = token;
//   //   console.log("check tiker")
//   //   console.log('subscribe', ticker.subscribe(items));
//   //   ticker.setMode(ticker.modeFull, items);
//   console.log(ticker)
//   ticker.disconnect();
//   ticker.connect();
//   // ticker.reconnect();
  
// }


// async function parameters(io, socket, ticker) {

//   try{
//     console.log("inside try 2");
//     console.log(ticker);
//     // if(getApiKey !== undefined && getAccessToken !== undefined){
//       // console.log("key token", getApiKey, getAccessToken);
//       // let token = await fetchData(getApiKey, getAccessToken);
//       let token = await fetchData(getApiKey, getAccessToken);
//       // let token = await fetchData('nq0gipdzk0yexyko', 'SRsDbH6dcBo7kce85M3tagzOj5s4aGX5');
//       // console.log("token", token);
//       // var KiteTicker = require('kiteconnect').KiteTicker;
//       // var ticker = new KiteTicker({
//       //   api_key: getApiKey,
//       //   access_token: getAccessToken,
//       // });
//       // console.log(ticker);
      
//       ticker.autoReconnect(true, 10000000000, 5);
//       ticker.connect();
//       ticker.on('ticks', onTicks);
//       ticker.on('connect', subscribe);
//       ticker.on('connect', onConnect);
//       ticker.on('disconnect', onDisconnect);
//       ticker.on('error', onError);
//       ticker.on('close', onClose);
//       // ticker.on("order_update", onTrade)
//       ticker.on("noreconnect", function () {
//         ticker.disconnect();
//         console.log("noreconnect");
//       });
    
//       ticker.on('reconnecting', function (reconnect_interval, reconnections) {
//         console.log(
//           'Reconnecting: attempt - ',
//            reconnections,
//           ' innterval - ',
//           reconnect_interval
//         );
//       });
    
//       function onConnect() {
//         console.log('connected to zerodha');
//         console.log('socket id is' + socket.id);
//       }
    
//       function onTicks(ticks) {
//         // console.log('ticks', ticks);
//         // var items = token;
//         // console.log('subscribe', ticker.subscribe(items));
//         // ticker.setMode(ticker.modeFull, items);

//           console.log("token", token)
//         if(token.length === ticks.length){
//           console.log('Ticks', ticks);
//           socket.emit('tick', ticks);
//           // console.log(socket);
//         } else{
//           // ticker.close();
//           // ticker.disconnect();
//         }
//       }
  
//       function onDisconnect(error) {
//         console.log('Closed connection on disconnect');
//       }
    
//       function subscribe() {

//         // tikerFunc();
//         var items = token;
//         console.log('subscribe', ticker.subscribe(items));
//         ticker.setMode(ticker.modeFull, items);
//       }
    
//       async function orderUpdateFunc() {
//         // console.log("updated order", orderUpdate)
//       }
 
//       async function onError(error) {
//         if(getApiKey !== undefined && getAccessToken !== undefined){
//           try{
//             console.log(error);
//             let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
//               let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
//                 let ticks = liveData.data
//                 console.log('tick', ticks);
//                 socket.emit('tick', ticks);
//           } catch(err){
//             throw new Error(err)
//           }
//         }

//         console.log('Closed connection on error', error);
//         // console.log(eventEmitOnError);
//         // if(eventEmitOnError){
//         //   eventEmitOnError = false;
//         //   const data = "Incorrect access token or api key";
//         //   socket.emit('wrongToken', data);
//         // }

//       }
    
//       function onClose(reason) {
//         console.log('Closed connection on close', reason);
//       }
    
//       let orderUpdate3 = {};
//       async function onTrade(order) {
//         console.log('Order update', order);
//         const order2 = order;
    
//         orderUpdate3 = await order2;
//         await executerr(orderUpdate3);
//       }    

//     // }
//     // else{
//       // console.log("no token");
//       // const data = "Please enter a valid access token or api key";
//       // socket.emit('noToken', data);
//     // }

//   } catch (err){
//     throw new Error(err);
//   }

// }
// module.exports = {parameters, tikerFunc};



