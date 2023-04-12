const mongoose = require("mongoose");
const { Schema } = mongoose;

const carouselSchema = new mongoose.Schema({
    carouselName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    carouselStartDate:{
        type:Date,
        required: true
    },
    carouselEndDate:{
        type:Date,
        required: true
    },
    status:{
        type:String,
        required:true,
        enum: ['Live','Draft','Rejected']
    },
    objectType:{
        type:String,
        required:true,
        enum: ['campaign','referral-program','contest']
    },
    objectId:{
        type: Schema.Types.ObjectId,
        refPath: 'objectType'
    },
    carouselImage:{
        type:String,
        required: true,
    },
    createdOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
})

const carouselData = mongoose.model("carousel", carouselSchema);
module.exports = carouselData;