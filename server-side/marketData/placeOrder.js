const axios = require("axios")
const express = require("express");
const router = express.Router();
const getOrderData = require("./retrieveOrder");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const CompanyTradeData = require("../models/TradeDetails/liveTradeSchema");
const TradeData = require("../models/TradeDetails/allTradeSchema"); 
const UserTradeData = require("../models/TradeDetails/liveTradeUserSchema")
const MockTradeCompany = require("../models/mock-trade/mockTradeCompanySchema")
const MockTradeUser = require("../models/mock-trade/mockTradeUserSchema");
const RetreiveOrder = require("../models/TradeDetails/retreiveOrder");
const { response } = require("express");
const authoizeTrade = require('../controllers/authoriseTrade');

// 
router.post("/placeorder", authoizeTrade.fundCheck,  (async (req, res)=>{
}))

module.exports = router;