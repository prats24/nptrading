const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {newTrade, getUserTrades, currentUser} = require('../../controllers/contestTradeController');
const authoizeTrade = require('../../controllers/authoriseTrade');


router.route('/:id').post(Authenticate, authoizeTrade.contestFundCheck, newTrade);
router.route('/myTrades').get(Authenticate, currentUser , getUserTrades);
router.route('/:userId').get(Authenticate, getUserTrades);


module.exports = router;

