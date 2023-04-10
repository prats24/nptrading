const express = require("express");
const router = express.Router({mergeParams: true});
const {createPortfolio, getPortfolios, getPortfolio, editPortfolio,editPortfolioWithName,getContestPortolios,getTradingPortolios,getInactivePortolios} = require('../../controllers/portfolioController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createPortfolio).get(getPortfolios).patch(Authenticate, editPortfolioWithName)
// router.route('/mycontests').get(Authenticate, myContests);
router.route('/contest').get(getContestPortolios)
router.route('/trading').get(getTradingPortolios)
router.route('/inactive').get(getInactivePortolios)
router.route('/:id').get(getPortfolio).patch(Authenticate, editPortfolio)
// router.use('/:id/trades', contestTradeRoutes);
module.exports = router;