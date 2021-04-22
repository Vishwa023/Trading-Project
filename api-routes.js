const router = require('express').Router();

var portfolioController = require('./controller/portfolio.controller.js');

var tradeController = require('./controller/trade.controller.js');

router.get('/', function(req, res) { res.send("Hello From the Home Page"); });

router.route('/portfolio').get(portfolioController.showPortfolio);

router.route('/portfolio/return').get(portfolioController.fetchReturn);

router.route('/trade').get(tradeController.showTrades);

router.route('/trade/add').post(tradeController.addTrades);

router.route('/trade/:ticker/:tradeId').put(tradeController.updateParticularTrade)
                               .delete(tradeController.removeParticularTrade);

module.exports = router;