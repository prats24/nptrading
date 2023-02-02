const express = require("express");
const router = express.Router();
const dailyPnlDataController = require("../../controllers/dailyPnlDataController")
const traderDailyPnlDataController = require("../../controllers/traderwiseDailyPnlController")

router.post("/dailypnlcalculation",dailyPnlDataController.dailyPnlCalculation)

router.post("/traderdailypnlcalculation",traderDailyPnlDataController.traderDailyPnlCalculation)

router.get("/dailypnldata/:selectDate",dailyPnlDataController.getDailyPnlData)

router.get("/dailypnlmaxmindata/",dailyPnlDataController.getDailyPnlMaxMinData)

router.get("/deleteduplicate/",dailyPnlDataController.deleteDuplicateData)

router.get("/traderdailypnldata/:selectDate/:traderName",traderDailyPnlDataController.getTraderDailyPnlData)

router.get("/getstoplossstopprofitpnl/",traderDailyPnlDataController.getstoplossstopprofitpnl)





module.exports = router;

