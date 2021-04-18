const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
    tickerSymbol: String,
    averagePrice: Number,
    shareQty: Number
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

module.exports = Portfolio;