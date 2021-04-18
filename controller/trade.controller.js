const log = require('simple-node-logger').createSimpleLogger();
var Trade = require("../models/trade.js");
var Portfolio = require("../models/portfolio");

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

                console.log('Trade Not found while adding a Trade in TradeList');

                let newTrade = new Trade();
                newTrade.tradeStockTickerSymbol = req.body.tradeStockTickerSymbol;
                req.body.tradeDetails.forEach(function (t) {
                    newTrade.tradeDetails.push(t);
                });

                Portfolio.findOne({
                    tickerSymbol: req.body.tradeStockTickerSymbol
                }, function (err, stock) {
                    if (err) {
                        console.log(err);
                        console.log('Error while finding the stock in portfolio .... ');
                    } else {
                        console.log('stock--->>',stock);
                        // console.log('stock - size--->>>',stock.length);
                        if (stock == null) {

                            console.log('stock not found in portfolio while adding a trade');

                            if (req.body.tradeDetails.tradeType == "SELL") {
                                console.log('you do not have enough quantity to sell');
                                res.json({
                                    message: "You can't sell stocks as you haven't buy them yet!!"
                                });
                            } else {
                                let newStock = new Portfolio();
                                console.log(req.body.tradeDetails);
                                newStock.tickerSymbol = req.body.tradeStockTickerSymbol;
                                newStock.averagePrice = req.body.tradeDetails[0].tradeStockPrice;
                                newStock.shareQty = req.body.tradeDetails[0].tradeQty;
                                console.log(newStock);
                                newStock.save();
                            }
                        } else {

                            console.log('stock is found in portfolio while adding a trade');
                            console.log(stock);

                            if(req.body.tradeDetails.tradeType == "SELL") {
                                if(req.body.tradeDetails.tradeQty > stock.shareQty) {
                                    console.log('you do not have enough quantity to sell');
                                    res.json({
                                        message: "You can't sell stocks as you haven't buy them yet!!"
                                    });
                                } else {
                                    stock.shareQty -= req.body.tradeDetails[0].tradeQty;
                                    stock.save();
                                }

                            } else {
                                stock.averagePrice = ((stock.averagePrice * stock.shareQty) + (req.body.tradeDetails[0].tradeQty * req.body.tradeDetails[0].tradeStockPrice)) / (stock.shareQty + req.body.tradeDetails[0].tradeQty);
                                stock.shareQty += req.body.tradeDetails[0].tradeQty;
                                console.log(stock);
                                stock.save();
                                // stock.save(function(err) {
                                //     if(err) {
                                //         console.log(err);
                                //     } else {
                                //         res.json({
                                //             data: stock
                                //         });
                                //     }
                                // });
                            }
                        }
                    }
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