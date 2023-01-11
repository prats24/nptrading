const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});


const DB = process.env.DATABASE;
    const devDB = process.env.DEVDATABASE;
//  mongoose.connect(devDB, {
   mongoose.connect(DB, {
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
    // useFindAndModify: false
    
}).then(()=>{
    console.log("connection secure");
}).catch((err)=>{
    console.log("no connection");
})
