const UserDetails = require("../models/User/userDetailSchema");

async function pnlcalucationnorunninglotsuser(traderdata){
console.log("Inside Trader wise pnl calculation function")
const userdetails = await UserDetails.find();
console.log(userdetails.length);
let name = '';
//console.log(data[0]);
let traderpnldata = [];
for(let i = 0; i <= userdetails.length; i++){
let hash = new Map();
let hashForTraderCount = new Map();
            let numberOfTrader = 0;
            let numberOfTrade = 0;
            let transactionCost = 0;
            let totalPnl = 0;
            let lotUsed = 0;

            console.log(userdetails[i]);


            let data = traderdata.filter((element)=>{
                console.log("Data filtered for :" +element.userId)
                console.log("Data filtered for :" +userdetails[i].email)
                //console.log(elem,element)
                return element.userId === userdetails[i].email
                
            });

            console.log(data)
            if(data.length == 0){
            for(let i = data.length-1; i >= 0 ; i--){
                console.log("Inside for loop");
                numberOfTrade += 1;
                transactionCost += Number(data[i].brokerage);

                if(!hashForTraderCount.has(data[i].userId)){
                    numberOfTrader += 1;
                    hashForTraderCount.set(data[i].userId, 1);
                }

                if(hash.has(data[i].symbol)){
                    let obj = hash.get(data[i].symbol);
                    if(data[i].buyOrSell === "BUY"){
                        if(obj.totalBuy === undefined || obj.totalBuyLot === undefined){
                            obj.totalBuy = data[i].amount
                            obj.totalBuyLot = (Number(data[i].Quantity))
                        } else{
                            obj.totalBuy = obj.totalBuy + data[i].amount
                            obj.totalBuyLot = obj.totalBuyLot + (Number(data[i].Quantity)) 
                        }

                    } if(data[i].buyOrSell === "SELL"){
                        if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                            obj.totalSell = data[i].amount
                            obj.totalSellLot = (Number(data[i].Quantity)) 
                        } else{

                            obj.totalSell = obj.totalSell + data[i].amount
                            obj.totalSellLot = obj.totalSellLot + (Number(data[i].Quantity)) 
                        }
                    }
                }  else{
                    if(data[i].buyOrSell === "BUY"){
                        hash.set(data[i].symbol, {
                            totalBuy : data[i].amount,
                            totalBuyLot : (Number(data[i].Quantity)) ,
                            totalSell: 0,
                            totalSellLot: 0,
                            symbol: data[i].symbol,
                            Product: data[i].Product,
                            name: data[0].createdBy,
                            date: ((data[0].order_timestamp).split(" "))[0]
                        })
                    }if(data[i].buyOrSell === "SELL"){
                        hash.set(data[i].symbol, {
                            totalSell : data[i].amount,
                            totalSellLot : (Number(data[i].Quantity)) ,
                            totalBuy : 0,
                            totalBuyLot: 0,
                            symbol: data[i].symbol,
                            Product: data[i].Product,
                            name: data[0].createdBy,
                            date: ((data[0].order_timestamp).split(" "))[0]
                        })
                    }
                }
            }
            
            let overallPnl = [];
            

            for (let value of hash.values()){
                overallPnl.push(value);
            }
            // let liveDetailsArr = [];
            // overallPnl.map((elem)=>{
            //     tradeData.map((element)=>{
            //         if(element.symbol === elem.symbol){
            //             marketData.map((subElem)=>{
            //                 if(subElem !== undefined && subElem.instrument_token === element.instrumentToken){
            //                     liveDetailsArr.push(subElem)
            //                 }
            //             })
            //         }
            //     })
            // })

            //console.log(hashForTraderCount)
            console.log(overallPnl);

            let runningLots;
            overallPnl.map((elem, index)=>{
                console.log("Inside Overall pnl loop");
                // name = elem.name;
                
                if(elem.totalBuyLot+elem.totalSellLot === 0){
                    totalPnl += -(elem.totalBuy+elem.totalSell)
                
                }
                // else{
                //     totalPnl += (-(elem.totalBuy+elem.totalSell-(elem.totalBuyLot+elem.totalSellLot)*liveDetailsArr[index]?.last_price))
                // }
                
            // console.log( liveDetailsArr[index]?.last_price)
            // console.log(elem.totalBuy,elem.totalSell,elem.totalBuyLot,elem.totalSellLot, liveDetailsArr[index]?.last_price)
                lotUsed += Math.abs(elem.totalBuyLot) + Math.abs(elem.totalSellLot);
                runningLots = elem.totalBuyLot + elem.totalSellLot
            })
        

                    let newObj = {
                        brokerage: transactionCost,
                        pnl: totalPnl,
                        name: name,
                        numberOfTrade: numberOfTrade,
                        lotUsed: lotUsed,
                        date: overallPnl[0].date,
                        numberOfTrader: numberOfTrader,
                        runningLots: runningLots
                    }
                    traderpnldata.push(newObj);
                }
            }
        



            //let date = (overallPnl[0].date).split("-");


return traderpnldata;
}

module.exports = pnlcalucationnorunninglotsuser;