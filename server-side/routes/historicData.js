const axios = require('axios');

async function fetchToken (exchange, symbol){
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/";
    let getAccessToken;
    let getApiKey;
    let instrumentToken ;

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
    const urlToken = `https://api.kite.trade/quote?${addUrl}`

    let auth = 'token' + getApiKey + ':' + getAccessToken;
    
    let authOptions = {
        headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
        },
    };
    const resp = await axios.get(urlToken, authOptions);
    for (let elem in resp.data.data) {
        instrumentToken = (resp.data.data[elem].instrument_token);
    }
    return instrumentToken;
}

module.exports = fetchToken;