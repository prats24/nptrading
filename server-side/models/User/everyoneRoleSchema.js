const mongoose = require("mongoose");

const everyoneRoleSchema = new mongoose.Schema({
    uId:{
        type: String,
        required : true
    },
    createdOn:{
        type: String,
        required : true
    },
    lastModified:{
        type: String,
        required : true
    },
    createdBy:{
        type: String,
        required : true
    },
    roleName:{
        type: String,
        required : true
    },
    instruments:{
        type: String,
        required : true
    },
    tradingAccount:{
        type: String,
        required : true
    },
    APIParameters:{
        type: String,
        required : true
    },
    users:{
        type: String,
        required : true
    },
    algoBox:{
        type: String,
        required : true
    },
    reports:{
        type: String,
        required : true
    }

})

const everyoneRoleDetail = mongoose.model("role-detail", everyoneRoleSchema);
module.exports = everyoneRoleDetail;