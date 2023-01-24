const express = require("express");
const router = express.Router();
const dailyPnlDataController = require("../../controllers/dailyPnlDataController")

router.post("/dailypnlcalculation",dailyPnlDataController.dailyPnlCalculation)

router.get("/dailypnldata/:selectDate",dailyPnlDataController.getDailyPnlData)

router.get("/dailypnlmaxmindata/",dailyPnlDataController.getDailyPnlMaxMinData)

router.get("/deleteduplicate/",dailyPnlDataController.deleteDuplicateData)




module.exports = router;

