const express = require("express");
const router = express.Router();
const openPositions = require("../../marketData/getOpenPosition")



router.get("/getOpenPositions",openPositions);

module.exports = router;