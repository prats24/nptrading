const express = require("express");
const router = express.Router();
require("../../db/conn");
const SearchInstrument = require("../../controllers/TradableInstrument/searchInstrument")

router.get("/tradableInstruments", async (req, res)=>{
    const input = req.query.search;
    await SearchInstrument.search(input, res)
})


module.exports = router;