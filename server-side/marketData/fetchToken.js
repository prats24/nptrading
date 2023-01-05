const axios = require('axios');

const fetchData = async (getApiKey, getAccessToken) => {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let date = new Date();
  let addUrl = '';

  try{
    const resp = await axios.get(`${baseUrl}api/v1/readInstrumentDetails`);
    let ans = resp.data.filter((elem) => {
      return elem.status === 'Active'
    });
    
    ans.forEach((elem, index) => {
      if (index === 0) {
        addUrl = 'i=' + elem.exchange + ':' + elem.symbol;
      } else {
        addUrl += '&i=' + elem.exchange + ':' + elem.symbol;
      }
    });  
  } catch(err) {
    return new Error(err);
  }

  let url = `https://api.kite.trade/quote?${addUrl}`;
  const api_key = getApiKey;
  const access_token = getAccessToken;
  let auth = 'token' + api_key + ':' + access_token;

  let authOptions = {
    headers: {
      'X-Kite-Version': '3',
      Authorization: auth,
    },
  };


  let arr = [];
  try{
    const res = await axios.get(url, authOptions);
    // console.log("its json data", JSON.stringify(res.data));
    for (instrument in res.data.data) {
      arr.push(res.data.data[instrument].instrument_token);
    }

    console.log("arr in fetch token", arr);
    return arr;

  } catch (err){
    return new Error(err);
  }  
};

module.exports = fetchData;