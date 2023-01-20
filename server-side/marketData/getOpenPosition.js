const axios = require("axios")
const express = require("express");
const router = express.Router();
const getKiteCred = require('../marketData/getKiteCred'); 
const nodemailer = require('nodemailer');

  const getOpenPositionData = async (req,res) => {
    getKiteCred.getAccess().then(async (data)=>{
    console.log("Inside Open Position Code")
    const api_key = data.getApiKey;
    const access_token = data.getAccessToken;
    let auth = 'token' + api_key + ':' + access_token;
            
    const url = `https://api.kite.trade/portfolio/positions`;
        
    let authOptions = {
        headers: {
        'X-Kite-Version': '3',
        Authorization: auth,
        },
    };

    const response = await axios.get(url, authOptions);
    const openpositions = (response.data.data);
    // console.log("Open Positions TS :"+response.data.data.net[0].tradingsymbol)
    // console.log("Open Positions Q :"+response.data.data.net[0].quantity)
    // console.log("Open Positions TS1 :"+response.data.data.net[1].tradingsymbol)
    // console.log("Open Positions Q1 :"+response.data.data.net[1].quantity)
    // console.log("Open Positions TS2 :"+response.data.data.net[2].tradingsymbol)
    // console.log("Open Positions Q2 :"+response.data.data.net[2].quantity)
    // console.log("Open Positions TS3 :"+response.data.data.net[3].tradingsymbol)
    // console.log("Open Positions Q3 :"+response.data.data.net[3].quantity)
    res.send(response.data.data.net);
    
})
}
module.exports = getOpenPositionData;