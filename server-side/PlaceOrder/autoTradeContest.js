const contestTrade = require('../controllers/contestTradeController');

exports.switchAllTrade = async (data, res, req) => { 
    for(let i = 0; i < data.length; i++){
        let date = new Date();
        let transaction_type = data[i].lots > 0 ? "BUY" : "SELL";
        let quantity = Math.abs(data[i].lots);

        let buyOrSell
        if(transaction_type === "BUY"){
            buyOrSell = "SELL";
        } else{
            buyOrSell = "BUY";
        }

        // console.log("this is data", data[i])
        // realSymbol: data[i]._id.symbol,
        let Obj = {};
        Obj.symbol = data[i]._id.symbol ;
        Obj.Product = data[i]._id.product ;
        Obj.instrumentToken = data[i]._id.instrumentToken ;
        Obj.real_instrument_token = data[i]._id.instrumentToken ;
        Obj.exchange = data[i]._id.exchange ;
        Obj.validity = data[i]._id.validity ;
        Obj.OrderType = data[i]._id.order_type ;
        Obj.variety = data[i]._id.variety ;
        Obj.buyOrSell = buyOrSell ;
        Obj.createdBy = data[i]._id.name ;
        Obj.trader = data[i]._id.trader ;
        Obj.portfolioId = data[i]._id.portfolioId ;
        Obj.autoTrade = true ;
        Obj.uId = Date.now(),
        Obj.order_id = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
        Obj.dontSendResp = (i !== (data.length-1));

    //    console.log("Obj", Obj)
        let interval = setInterval(async () => {
            if (quantity > 1800) {
                Obj.Quantity = 1800
                Obj.dontSendResp = true
                req.body = JSON.parse(JSON.stringify(Obj))
                await contestTrade.newTrade(req, res);
                quantity = quantity - 1800;
            } else {
                Obj.Quantity = quantity
                if(i === (data.length-1)){
                    Obj.dontSendResp = false;
                  } 
                req.body = JSON.parse(JSON.stringify(Obj))
                // console.log(req.body)
                if(quantity > 0){
                    await contestTrade.newTrade(req, res);
                }
                await clearInterval(interval);
            }
        }, 300);

    }
}