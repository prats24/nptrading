const axios = require('axios');
const zlib = require('zlib');
const csv = require('csv-parser');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema")
const getKiteCred = require('../../marketData/getKiteCred'); 


exports.search = async (searchString, res, req) => {
    console.log(searchString)
    // const searchedInstrument = await TradableInstrument.find({
    //     $or: [
    //         { tradingsymbol: { $regex: searchString, $options: 'i' } },
    //         { name: { $regex: searchString, $options: 'i' } },
    //         { exchange: { $regex: searchString, $options: 'i' } }
    //       ]
    //     // { tradingsymbol: { $regex: searchString }, $options: 'i' })
    //     }).sort({expiry: 1});

    // res.send(searchedInstrument)

//------------------------------------
const page = parseInt(req.query.page);
const size = parseInt(req.query.size);

try {
//   const client = await MongoClient.connect(url);
//   const db = client.db('mydb');
  const data = await TradableInstrument.find({
        $or: [
            { tradingsymbol: { $regex: searchString, $options: 'i' } },
            { name: { $regex: searchString, $options: 'i' } },
            { exchange: { $regex: searchString, $options: 'i' } }
          ]
        // { tradingsymbol: { $regex: searchString }, $options: 'i' })
        })
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  res.json(data);
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Internal Server Error' });
}

}



