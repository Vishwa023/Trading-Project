const log = require('simple-node-logger').createSimpleLogger();
var Portfolio      = require("../models/portfolio.js");

// let p = new Portfolio({
//     tickerSymbol: "WIPRO",
//     averagePrice: 100,
//     shareQty: 1
// });

// p.save();

exports.showPortfolio = function(req, res) {

    log.info('showPortfolio -> function - started');

    Portfolio.find({}, function(err, stockList) {
        if(err) {
            console.log('error while finding the stock List .......');
        } else {
            res.json({
                data: stockList
            });
        }
    });
};

exports.fetchReturn = function(req, res) {

    log.info('fetchReturn -> function - started');   

    let curVal = 100;

    Portfolio.find({}, function(err, stockList) {
        if(err) {
            console.log('error while finding the stock List ....... ');
        } else {
            let plusVal = 0;
            let minusVal = 0;
            stockList.forEach(function(stock) {
                if(curVal >= stock.averagePrice) {
                    plusVal += ((curVal - stock.averagePrice) * (stock.shareQty));
                } else {
                    minusVal += ((stock.averagePrice - curVal) * (stock.shareQty));
                }
            });

            if(plusVal === minusVal) {
                res.json({
                    returnVal: 0,
                    profitType: "Balanced"
                });
            } else if(plusVal >= minusVal) {
                res.json({
                    returnVal: plusVal - minusVal,
                    profitType: "Positive"
                });
            } else {
                res.json({
                    returnVal: minusVal - plusVal,
                    profitType: "Negative"
                });
            }
        }
    });
};

