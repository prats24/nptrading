const mongoose = require("mongoose");

const productMappingSchema = new mongoose.Schema({
    ProductNameIncoming:{ // IncomingProductCode, ProductNameOutgoing, OutgoingProductCode
        type: String,
        required: true
    },
    IncomingProductCode:{
        type: String,
        required : true
    },
    ProductNameOutgoing:{
        type: String,
        required : true
    },
    Status:{
        type: String,
        required : true
    },
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
    OutgoingProductCode:{
        type: String,
        required : true
    }
})

const productMappingDetail = mongoose.model("algo-product", productMappingSchema);
module.exports = productMappingDetail;