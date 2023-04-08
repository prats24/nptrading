const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {newTrade, getUserTrades, currentUser} = require('../../controllers/contestTradeController');

router.route('/').post(Authenticate, newTrade);
router.route('/myTrades').get(Authenticate, currentUser , getUserTrades);
router.route('/:userId').get(Authenticate, getUserTrades);


module.exports = router;

