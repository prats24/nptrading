const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {newTrade, getUserTrades, currentUser, getContestRank, getMyContestRank, getContestPnl} = require('../../controllers/contestTradeController');
const authoizeTrade = require('../../controllers/authoriseTrade');

router.route('/myTrades').get(Authenticate, currentUser , getUserTrades);
router.route('/pnl').get(Authenticate, getContestPnl);

router.route('/rank').get(getContestRank);
router.route('/myrank').get(Authenticate, getMyContestRank);

router.route('/').post(Authenticate, authoizeTrade.contestFundCheck, newTrade);
// router.route('/:userId').get(Authenticate, getUserTrades);

// router.route('/').post(Authenticate, newTrade);
// // router.route('/').get(Authenticate, getUserTrades);




module.exports = router;
// portfolio id se portfolio get krna
// userid se perticular user get krna
// then us user ka portfolio get krna

// step 2

// portfolio id and userid se us portfolio ka pnl get krna
