const axios = require('axios');
const zlib = require('zlib');
const csv = require('csv-parser');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema")
const getKiteCred = require('../../marketData/getKiteCred'); 


exports.search = async (searchString, res, req) => {
    console.log(searchString)
    const searchedInstrument = await TradableInstrument.find({
        $or: [
            { tradingsymbol: { $regex: searchString, $options: 'i' } },
            { name: { $regex: searchString, $options: 'i' } },
            { exchange: { $regex: searchString, $options: 'i' } }
          ]
        // { tradingsymbol: { $regex: searchString }, $options: 'i' })
        }).sort({expiry: 1});

    res.send(searchedInstrument)

//------------------------------------
    // const pageSize = 10;

    // // Get the current page number from the query parameters
    // const pageNumber = req.query.page || 1;
  
    // // Calculate the number of items to skip based on the current page number and page size
    // const skip = (pageNumber - 1) * pageSize;
  
    // // Retrieve the data from the database, skipping the appropriate number of items and limiting the result to the page size
    
    // const searchedInstrument = await TradableInstrument.find({
    //     $or: [
    //         { tradingsymbol: { $regex: searchString, $options: 'i' } },
    //         { name: { $regex: searchString, $options: 'i' } },
    //         { exchange: { $regex: searchString, $options: 'i' } }
    //       ]
    //     // { tradingsymbol: { $regex: searchString }, $options: 'i' })
    //     }).skip(skip).limit(pageSize).sort({expiry: 1});
    
    // // const data = await MyDataModel.find().;
  
    // // Return the data as a JSON response
    // res.json(searchedInstrument);

}



