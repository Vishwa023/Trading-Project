const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
    tradeStockTickerSymbol: String,
    tradeDetails: [{
        tradeStockPrice: Number,
        tradeType: String,
        tradeQty: Number
    }]
});

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = Trade;