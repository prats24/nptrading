const axios = require('axios');
const zlib = require('zlib');
const csv = require('csv-parser');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema")
const getKiteCred = require('../../marketData/getKiteCred'); 


exports.tradableInstrument = async () => {

    getKiteCred.getAccess().then((data)=>{
        console.log(data)
        // createNewTicker(data.getApiKey, data.getAccessToken);
        const url = 'https://api.kite.trade/instruments/NFO';


        const api_key = data.getApiKey;
        const access_token = data.getAccessToken;
        let auth = 'token ' + api_key + ':' + access_token;
    

        // Connection string for MongoDB
        // const connectionString = 'mongodb://localhost:27017/mydatabase';
    
        // Options for the HTTP request
        const options = {
            headers: {
                'X-Kite-Version':'3',
                'Authorization': auth,
                'Accept-Encoding': 'gzip',
            },
            responseType: 'stream',
        };
    
        // Create a connection to MongoDB
        // const client = new MongoClient(connectionString);
        // client.connect();
        // const database = client.db('mydatabase');
    
        // Make the HTTP request to the API


        axios.get(url, options)
        .then((response) => {
            // If the response is gzipped, decompress it
            const unzip = response.headers['content-encoding'] === 'gzip'
            ? response.data.pipe(zlib.createGunzip())
            : response.data;

            console.log("unzip", unzip)
            // Parse the CSV data from the response
            unzip
            .pipe(csv())
            .on('data', async (row) => {
                // Insert the row into the MongoDB collection
                // console.log("getting row before if", row)
                // Insert the row into the MongoDB collection
                if((row.name == "NIFTY" || row.name == "BANKNIFTY") && row.segment == "NFO-OPT"){
                    console.log("getting row", row);
                    if(row.name === "NIFTY"){
                        row.name = row.name+"50"
                    }
                    
                    await TradableInstrument.create(row);
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
        })
        .catch((error) => {
            console.error(error);
        });
    

    });

    // URL to the API


}



