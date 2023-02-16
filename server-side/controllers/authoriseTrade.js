const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const DailyPnlData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema");
const MockTradeData = require("../models/mock-trade/mockTradeCompanySchema");
const UserDetail = require("../models/User/userDetailSchema");

exports.fundCheck = async(req, res, next) => {

    const {apiKey, accessToken, exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity, userId} = req.body;
    
    const api_key = apiKey;
    const access_token = accessToken;
    let auth = 'token ' + api_key + ':' + access_token;

    let headers = {
        'X-Kite-Version':'3',
        'Authorization': auth,
        "content-type" : "application/json"
    }
    let orderData =     {
        "exchange": exchange,
        "tradingsymbol": symbol,
        "transaction_type": buyOrSell,
        "variety": variety,
        "product": Product,
        "order_type": OrderType,
        "quantity": Quantity,
        "price": 0,
        "trigger_price": 0
    }

    const user = await UserDetail({email: userId})

    const marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, {headers : headers}, orderData)

}