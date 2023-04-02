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

console.log(page, size)

try {

  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  let fromLessThen = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()+7).padStart(2, '0')}`
  console.log(todayDate, fromLessThen)
  const data = await TradableInstrument.find({
    $or: [
      { tradingsymbol: { $regex: searchString, $options: 'i' } },
      { name: { $regex: searchString, $options: 'i' } },
      { exchange: { $regex: searchString, $options: 'i' } },
      { expiry: { $regex: searchString, $options: 'i' } },
    ],
    expiry: {
      $gte: todayDate, // expiry is greater than or equal to today's date
      $lt: fromLessThen
      // $gt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) // expiry is greater than today's date
    }
  })
  .sort({ expiry: 1 })
  .limit(size)
  .exec();

  res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}



