const mongoose = require("mongoose");
const { Schema } = mongoose;

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
    },
    invitedOn: {
        type: Date,
        default: Date.now()
    },
    invitedBy:{
        type:Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    status:{
        type: String,
        enum: ['Invited','Joined']
    },
    joinedOn: {
        type: Date,
    },
    referralCode: {
        type: String,
    },
    referralProgram:{
        type: Schema.Types.ObjectId,
        ref: 'referral-program',
    },
    emailStatus:{
        type: String
    },
    smsStatus:{
        type: String
    }
});

const lead = mongoose.model('lead', leadSchema);
module.exports = lead;