const mongoose = require("mongoose");
const { Schema } = mongoose;

const Payment = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
    },
    paymentTime: Date,
    createdOn: {
        type: Date,
        default: Date.now()
    },
    createdBy:Schema.Types.ObjectId,
    paymentStatus:{
        type: String,
        enum:['succeeded', 'failed', 'processing']
    },
});

const payment = mongoose.model('payment', Payment);
module.exports = payment;