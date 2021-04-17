const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    tickerSymbol: String,
    averagePrice: Number
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;