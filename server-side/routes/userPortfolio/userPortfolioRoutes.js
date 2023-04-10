const express = require("express");
const router = express.Router({mergeParams: true});
const {createPortfolio, getPortfolios, getPortfolio, editPortfolio, editPortfolioWithName, getContestPortolios} = require('../../controllers/portfolioController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createPortfolio).get(getPortfolios).patch(Authenticate, editPortfolioWithName)
// router.route('/mycontests').get(Authenticate, myContests);
router.route('/contest').get(getContestPortolios)
router.route('/:id').get(getPortfolio).patch(Authenticate, editPortfolio)
// router.use('/:id/trades', contestTradeRoutes);
module.exports = router;