const axios = require('axios');
const zlib = require('zlib');
const csv = require('csv-parser');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema")
const getKiteCred = require('../../marketData/getKiteCred'); 


exports.search = async (searchString, res) => {
//, 
    console.log(searchString)
    // searchString = Number(searchString)
    const searchedInstrument = await TradableInstrument.find({ tradingsymbol: { $regex: searchString }, $options: 'i' });

    res.send(searchedInstrument)

}



