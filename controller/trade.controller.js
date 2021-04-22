const log = require('simple-node-logger').createSimpleLogger();
var Trade = require("../models/trade.js");
var Portfolio = require("../models/portfolio");


//Function will return list of trades 
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


//Function will add trade in trade List and it will be reflected in portfolio
exports.addTrades = function (req, res) {

    log.info('addTrades -> function - started');

    Trade.findOne({

        tradeStockTickerSymbol: req.body.tradeStockTickerSymbol

    }, function (err, trade) {

        if (err) {

            console.log(err);

            console.log('Error while finding ticker symbol to add a trade ....');

        } else {

            //If the requested trade qty is negative then we simply send message please enter positive value
            if (req.body.tradeDetails[0].tradeQty <= 0) {

                console.log('user has entered nagative stock value');

                res.json({
                    message: "you can't pass nagative stock Qty!!!"
                });

            } else {

                //It will check in portfolio if we can add a trade or not 
                Portfolio.findOne({

                    tickerSymbol: req.body.tradeStockTickerSymbol

                }, function (err, stock) {

                    if (err) {

                        console.log(err);

                        console.log('Error while finding the stock in portfolio .... ');

                    } else {

                        // If stock is not present in the portfolio
                        if (stock == null) {

                            console.log('stock not found in portfolio while adding a trade');

                            //It will check If we can sell the stocks or not
                            if (req.body.tradeDetails[0].tradeType == "SELL") {

                                console.log('you do not have enough quantity to sell');

                                res.json({
                                    message: "You don't have enough quantity to sell!!!"
                                });

                            } else {

                                //If the trade is buy type then we need to add the trade in portfolio and trade list

                                let newStock = new Portfolio();

                                newStock.tickerSymbol = req.body.tradeStockTickerSymbol;

                                newStock.averagePrice = req.body.tradeDetails[0].tradeStockPrice;

                                newStock.shareQty = req.body.tradeDetails[0].tradeQty;

                                newStock.save();

                                //Now we will add that trade into Trade List 
                                if (trade == null) {

                                    console.log('Trade Not found while adding a Trade in TradeList');

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

                        } else {

                            //If we found the requested add trade in portfolio 

                            console.log('stock is found in portfolio while adding a trade');

                            //It will check if we can add sell trade 
                            if (req.body.tradeDetails[0].tradeType == "SELL") {

                                if (req.body.tradeDetails[0].tradeQty > stock.shareQty) {

                                    res.json({
                                        message: "You don't have enough quantity to sell!!!"
                                    });

                                } else {

                                    stock.shareQty -= req.body.tradeDetails[0].tradeQty;

                                    stock.save();

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

                            } else {

                                //we have stock in portfolio and requested trade type is buy then we need to add that trade in trade list and need to update the portfolio

                                stock.averagePrice = ((stock.averagePrice * stock.shareQty) + (req.body.tradeDetails[0].tradeQty * req.body.tradeDetails[0].tradeStockPrice)) / (stock.shareQty + req.body.tradeDetails[0].tradeQty);

                                stock.shareQty += req.body.tradeDetails[0].tradeQty;

                                stock.save();

                                //If trade is null then we need to create a new trade in trade List
                                if (trade == null) {

                                    console.log('Trade Not found while adding a Trade in TradeList');

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

                                    //If we have found the trade in trade List then we need to add the trade in trade Details array

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
                        }
                    }
                });
            }
        }
    });
};

//Function will update a particular trade in trade List
exports.updateParticularTrade = function (req, res) {

    log.info('updateParticularTrade -> function - started');

    Trade.findOne({

        tradeStockTickerSymbol: req.params.ticker

    }, function (err, foundTrade) {

        if (err) {

            console.log(err);

            console.log('error while finding trade for update ......');

        } else {

            //If the requested update trade is not present in the trade list
            if (foundTrade == null) {

                console.log('Trade ticker symbol is not present in the list for update');

                res.json({
                    message: "Trade ticker symbol is not present in the list for update!!!"
                });

            } else {

                //If the requested trade is negative then we can't update that trade
                if (req.body.tradeDetails[0].tradeQty <= 0) {

                    console.log('user has entered nagative stock value');

                    res.json({
                        message: "you can't pass nagative stock Qty!!!"
                    });

                } else {

                    //We will go throgh all the trades and check if the requested trade can be updated or not
                    let tempTradeDetails = [];

                    let td = foundTrade.tradeDetails;

                    for (let i = 0; i < td.length; i++) {

                        let obj = {};

                        obj._id = td[i]._id;
                        obj.tradeStockPrice = td[i].tradeStockPrice;
                        obj.tradeType = td[i].tradeType;
                        obj.tradeQty = td[i].tradeQty;

                        tempTradeDetails.push(obj);
                    }

                    console.log('clonned TradeDetails Array -->> ', tempTradeDetails);

                    let reqUpdateDetails = req.body.tradeDetails[0];

                    let isTradePresent = false;

                    for (let i = 0; i < tempTradeDetails.length; i++) {

                        if (tempTradeDetails[i]._id == req.params.tradeId) {

                            tempTradeDetails[i].tradeStockPrice = reqUpdateDetails.tradeStockPrice;
                            tempTradeDetails[i].tradeType = reqUpdateDetails.tradeType;
                            tempTradeDetails[i].tradeQty = reqUpdateDetails.tradeQty;

                            isTradePresent = true;

                        }

                    }

                    //If the requested trade is not present in the trade list
                    if (!isTradePresent) {

                        console.log('Trade Id is not present in the list for update');

                        res.json({
                            message: "Trade Id is not present in the list for update!!!"
                        });

                    } else {

                        console.log('after updating clonned TradeDetails Array -->> ', tempTradeDetails);

                        let afterTradePortfolioStock = 0; // it will track the current stock qty

                        let afterTradePortfolioPrice = 0; // it will track the current stock qty price

                        var isTradeUpdatable = true; // it will check if the trade can be updated or not

                        for (let i = 0; i < tempTradeDetails.length; i++) {

                            if (tempTradeDetails[i].tradeType == "BUY") {

                                afterTradePortfolioPrice = ((afterTradePortfolioPrice * afterTradePortfolioStock) + (tempTradeDetails[i].tradeQty * tempTradeDetails[i].tradeStockPrice)) / (tempTradeDetails[i].tradeQty + afterTradePortfolioStock);

                                afterTradePortfolioStock += tempTradeDetails[i].tradeQty;

                            } else {

                                afterTradePortfolioStock -= tempTradeDetails[i].tradeQty;

                            }

                            //If the stock qty after every trade is negative then we update the isTradeUpdatable variable to false
                            if (afterTradePortfolioStock < 0) {
                                isTradeUpdatable = false;
                            }

                        }

                        //If the isTradeUpdatable variable is false then we can not update the requested trade
                        if (!isTradeUpdatable) {

                            console.log('you do not have enough quantity to sell');
                            res.json({
                                message: "Requested trade Can't be updated"
                            });

                        } else {

                            //We will update the trade if the stock qty is positive
                            foundTrade.tradeDetails = tempTradeDetails;

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

                            //We will update portfolio also with the updated qty and stock price
                            Portfolio.findOne({

                                tickerSymbol: req.params.ticker

                            }, function (err, stock) {

                                if (err) {

                                    console.log(err);

                                    console.log('error while finding a Portfolio while Updating a Trade ......');

                                } else {

                                    stock.shareQty = afterTradePortfolioStock;

                                    stock.averagePrice = afterTradePortfolioPrice;

                                    stock.save();

                                }

                            });

                        }
                    }
                }
            }
        }
    });
};

//Function will remove a particular trade from the trade list
exports.removeParticularTrade = function (req, res) {

    log.info('removeParticularTrade -> function - started');

    Trade.findOne({

        tradeStockTickerSymbol: req.params.ticker

    }, function (err, foundTrade) {

        if (err) {

            console.log(err);

            console.log('error while finding trade for remove ......');

        } else {

            //If the requested remove trade is not present in the trade list
            if (foundTrade == null) {

                console.log('Trade ticker symbol is not present in the list for remove');

                res.json({
                    message: "Trade ticker symbol is not present in the list for remove!!!"
                });

            } else {

                if (req.body.tradeDetails[0].tradeQty <= 0) {

                    console.log('user has entered nagative stock value');

                    res.json({
                        message: "you can't pass nagative stock Qty!!!"
                    });

                } else {

                    //We will go throgh all the trades and check if the requested trade can be removed or not

                    let tempTradeDetails = [];

                    let td = foundTrade.tradeDetails;

                    for (let i = 0; i < td.length; i++) {

                        let obj = {};

                        obj._id = td[i]._id;
                        obj.tradeStockPrice = td[i].tradeStockPrice;
                        obj.tradeType = td[i].tradeType;
                        obj.tradeQty = td[i].tradeQty;

                        tempTradeDetails.push(obj);
                    }

                    console.log('clonned TradeDetails Array -->> ', tempTradeDetails);

                    let isTradePresent = false;

                    for (let i = 0; i < tempTradeDetails.length; i++) {

                        if (tempTradeDetails[i]._id == req.params.tradeId) {

                            tempTradeDetails.splice(i, 1);

                            isTradePresent = true;

                        }

                    }

                    //If the requested trade is not present in the trade list
                    if (!isTradePresent) {

                        console.log('Trade Id is not present in the list for update');

                        res.json({
                            message: "Trade Id is not present in the list for update!!!"
                        });

                    } else {

                        console.log('after removing clonned TradeDetails Array -->> ', tempTradeDetails);

                        let afterTradePortfolioStock = 0; //It will track current stock qty
 
                        let afterTradePortfolioPrice = 0; //It will track current stock price

                        var isTradeRemovable = true; // It will check if the requested trade is removable or not

                        //loop will check after removing a particular trade stock qty is positive or not
                        for (let i = 0; i < tempTradeDetails.length; i++) {

                            if (tempTradeDetails[i].tradeType == "BUY") {

                                afterTradePortfolioPrice = ((afterTradePortfolioPrice * afterTradePortfolioStock) + (tempTradeDetails[i].tradeQty * tempTradeDetails[i].tradeStockPrice)) / (tempTradeDetails[i].tradeQty + afterTradePortfolioStock);

                                afterTradePortfolioStock += tempTradeDetails[i].tradeQty;

                            } else {

                                afterTradePortfolioStock -= tempTradeDetails[i].tradeQty;

                            }

                            if (afterTradePortfolioStock < 0) {
                                isTradeRemovable = false;
                            }

                        }


                        //If stock qty is negative then we can not remove reqested trade
                        if (!isTradeRemovable) {

                            console.log('you do not have enough quantity to sell');
                            res.json({
                                message: "Requested trade Can't be removed"
                            });

                        } else {

                            foundTrade.tradeDetails = tempTradeDetails;

                            foundTrade.save(function (err) { // It will save the trade list after removing a trade
                                if (err) {
                                    res.json(err);
                                } else {
                                    res.json({
                                        message: 'Removed A Particular Trade!',
                                        data: foundTrade
                                    });
                                }
                            });

                            //We will update the portfolio after removing a particular trade
                            Portfolio.findOne({

                                tickerSymbol: req.params.ticker

                            }, function (err, stock) {

                                if (err) {

                                    console.log(err);

                                    console.log('error while finding a Portfolio while Updating a Trade ......');

                                } else {

                                    stock.shareQty = afterTradePortfolioStock;

                                    stock.averagePrice = afterTradePortfolioPrice;

                                    stock.save();

                                }

                            });

                        }
                    }
                }
            }
        }
    });
};