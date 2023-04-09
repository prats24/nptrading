const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

// STAGINGDB    
const DB = process.env.DATABASE;
    const devDB = process.env.DEVDATABASE;
    const stagingDB = process.env.STAGINGDB;
mongoose.connect(stagingDB, {
        //  mongoose.connect(DB, {
        // mongoose.connect(stagingDB, {
    useNewUrlParser: true,
    
    
    useUnifiedTopology: true,
    // useFindAndModify: false
    
}).then(()=>{
    console.log("connection secure");
}).catch((err)=>{
    console.log("no connection");
})

