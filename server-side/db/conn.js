const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

// STAGINGDB    
const DB = process.env.DATABASE;
    const devDB = process.env.DEVDATABASE;
    const stagingDB = process.env.STAGINGDB;
// mongoose.connect(devDB, {
       mongoose.connect(DB, {
        // mongoose.connect(stagingDB, {
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
    // useFindAndModify: false
    
}).then(()=>{
    console.log("connection secure");
}).catch((err)=>{
    console.log("no connection");
})

/*
230201403382160
230201403406220
230201403525128
230201403665049
230201403444867
230201403444023
230201403414034 --- exist
230201403630600
230201403631446
*/
