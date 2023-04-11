const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {newTrade, getUserTrades, currentUser, getContestPnl} = require('../../controllers/contestTradeController');
const authoizeTrade = require('../../controllers/authoriseTrade');

router.route('/pnl').get(Authenticate, getContestPnl);
router.route('/myTrades').get(Authenticate, currentUser , getUserTrades);

router.route('/').post(Authenticate, newTrade);
// router.route('/').get(Authenticate, getUserTrades);



module.exports = router;
// , authoizeTrade.contestFundCheck

