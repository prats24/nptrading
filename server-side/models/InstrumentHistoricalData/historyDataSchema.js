const mongoose = require("mongoose");

const historyDataSchema = new mongoose.Schema({
    data: [
        {
            symbol:{
                type: String,
                required: true
            },
            timestamp:{
                type: String,
                required: true
            },
            uId:{
                type: String,
                required: true
            },
            date:{
                type: String,
                required: true
            },
            calculated_grossPnl:{
                type: Number,
                required: true
            },
            calculated_transcation_cost:{
                type: Number,
                required: true
            },
            calculated_netPnl:{
                type: Number,
                required: true
            },
            noOfOrders:{
                type: Number,
                required: true
            },
            closed_orders:{
                type: Number,
                required: true
            },
            open_orders:{
                type: Number,
                required: true
            },
            noOfTraders:{
                type: Number,
                required: true
            }
        }
    ]
})

const HistoryData = mongoose.model("history-data", historyDataSchema);
module.exports = HistoryData;