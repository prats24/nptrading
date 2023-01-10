const express = require("express");
const router = express.Router();
require("../../db/conn");
const HistoryData = require("../../models/InstrumentHistoricalData/InstrumentHistoricalData");


router.get("/historydata", (req, res)=>{
    // const {email} = req.params
    // let date = new Date();
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // console.log(todayDate);
    HistoryData.find()
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

module.exports = router;