const log = require('simple-node-logger').createSimpleLogger();
var Trade = require("../models/trade.js");

exports.showTrades = function (req, res) {

    log.info('showTades -> function - started');

    Trade.find({}, function (err, tradeList) {
        if (err) {
            console.log('error while finding the trade List .......');
        } else {
            res.json({
                data: tradeList
            });
        }
    });
};

exports.addTrades = function (req, res) {

    log.info('addTrades -> function - started');

    console.log(req.body);

    Trade.findOne({
        tradeStockTickerSymbol: req.body.tradeStockTickerSymbol
    }, function (err, trade) {

        if (err) {
            console.log('Error while finding ticker symbol to add a trade ....');
        } else {
            if (trade == null) {
                let newTrade = new Trade();
                newTrade.tradeStockTickerSymbol = req.body.tradeStockTickerSymbol;
                req.body.tradeDetails.forEach(function (t) {
                    newTrade.tradeDetails.push(t);
                });

                newTrade.save(function (err) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json({
                            message: 'New Trade created!',
                            data: newTrade
                        });
                    }
                });
            } else {
                let newTradeDetails = req.body.tradeDetails;
                newTradeDetails.forEach(function (t) {
                    trade.tradeDetails.push(t);
                });
                trade.save(function (err) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json({
                            message: 'New Trade created!',
                            data: trade
                        });
                    }
                });
            }
        }
    });
};

exports.showParticularTrade = function (req, res) {

    log.info('showParticularTrade -> function - started');

    Trade.findOne({
        tradeStockTickerSymbol: req.params.ticker
    }, function (err, foundTrade) {

        if (err) {
            console.log(err);
            console.log('error while finding the requested Trade .....');
        } else {
            let td = foundTrade.tradeDetails;
            td.forEach(function (val) {
                if (val._id == req.params.tradeId) {
                    // console.log(val);
                }
            });
            res.json({
                data: foundTrade
            });
        }
    });
};



exports.updateParticularTrade = function (req, res) {

    log.info('updateParticularTrade -> function - started');

    Trade.findOne({
        tradeStockTickerSymbol: req.params.ticker
    }, function (err, foundTrade) {

        if (err) {
            console.log(err);
            console.log('error while finding trade for update ......');
        } else {
            console.log(foundTrade);
            let td = foundTrade.tradeDetails;
            let reqUpdateDetails = req.body.tradeDetails;
            td.forEach(function (val) {
                if (val._id == req.params.tradeId) {
                    val.tradeStockPrice = reqUpdateDetails[0].tradeStockPrice ? reqUpdateDetails[0].tradeStockPrice : val.tradeStockPrice;
                    val.tradeType = reqUpdateDetails[0].tradeType ? reqUpdateDetails[0].tradeType : val.tradeType;
                    val.tradeQty = reqUpdateDetails[0].tradeQty ? reqUpdateDetails[0].tradeQty : val.tradeQty;
                }
            });
            console.log(foundTrade);
            foundTrade.save(function (err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        message: 'Updated A Particular Trade!',
                        data: foundTrade
                    });
                }
            });
        }
    });
};

exports.removeParticularTrade = function (req, res) {

    log.info('removeParticularTrade -> function - started');

    Trade.findOne({
        tradeStockTickerSymbol: req.params.ticker
    }, function (err, foundTrade) {

        if (err) {
            console.log(err);
            console.log('error while finding trade for update ......');
        } else {
            let td = foundTrade.tradeDetails;

            td.forEach(function (val) {
                if (val._id == req.params.tradeId) {
                    td.remove(val);
                }
            });

            foundTrade.save(function (err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        message: 'Removed A Particular Trade!',
                        data: foundTrade
                    });
                }
            });
        }
    });
};