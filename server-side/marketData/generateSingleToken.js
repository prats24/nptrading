const axios = require('axios');

async function fetchToken (exchange, symbol){
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/";
    let getAccessToken;
    let getApiKey;
    let instrumentToken ;
    // console.log("Exchange & Symbol: ",exchange,symbol)

    let accessTokenResp = await axios.get(`${baseUrl}api/v1/readRequestToken`)
    let apiKeyResp = await axios.get(`${baseUrl}api/v1/readAccountDetails`)

    for(let elem of accessTokenResp.data){
        for(let subElem of apiKeyResp.data){
            if(elem.accountId === subElem.accountId && elem.status === "Active" && subElem.status === "Active"){
                getAccessToken = elem.accessToken;
                getApiKey = subElem.apiKey
            }
        }
    }
    const addUrl = 'i=' + exchange + ':' + symbol;
    const url = `https://api.kite.trade/quote?${addUrl}`
    // console.log("URL: ",url)
    let auth = 'token' + getApiKey + ':' + getAccessToken;
    // console.log("Auth: ",auth,getApiKey,getAccessToken)
    
    let authOptions = {
        headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
        },
    };

    // console.log(authOptions)
    try{
    const resp = await axios.get(url, authOptions);
    // console.log(resp)
    for (let elem in resp.data.data) {
        instrumentToken = (resp.data.data[elem].instrument_token);
        console.log(instrumentToken)
    }
    return instrumentToken;
    }
    catch(err){
        return console.log(err)
    }
}

module.exports = fetchToken;