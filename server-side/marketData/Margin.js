const getKiteCred = require('./getKiteCred'); 
const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../db/conn");


router.get("/getmargin", (req, res)=>{

    getKiteCred.getAccess().then(async (data)=>{
          
        let url = `https://api.kite.trade/user/margins`;
        const api_key = data.getApiKey; 
        const access_token = data.getAccessToken;
        let auth = 'token' + api_key + ':' + access_token;
      
        let authOptions = {
            headers: {
                'X-Kite-Version': '3',
                Authorization: auth,
            },
        };
      
        try{
            const equity = "equity"
            const response = await axios.get(url, authOptions);
            for (let elem in response.data.data) {
                if(elem === equity){
                    console.log(response.data.data[elem]);
                    return res.status(201).send((response.data.data[elem]));
                }
            }
        } catch (err){
            return res.status(422).json({error : "Failed to send data"});
        }  
    });
})

module.exports = router;