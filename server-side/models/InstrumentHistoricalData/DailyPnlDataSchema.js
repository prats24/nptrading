const mongoose = require("mongoose");

const dailyPnlDataSchema = new mongoose.Schema({
            symbol:{
                type: String,
                required: true
            },
            timestamp:{
                type: String,
                required: true
            },
            calculatedGpnl:{
                type: Number,
                required: true
            },
            noOfTrades:{
                type: Number,
                required: true
            },
            noOfTraders:{
                type: Number,
                required: true
            }
    })

const DailyPnlData = mongoose.model("daily-pnl-data", dailyPnlDataSchema);
module.exports = DailyPnlData;