const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema for the portfolio
const PortfolioSchema = new Schema({
    tickerSymbol: String,
    averagePrice: Number,
    shareQty: Number
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

module.exports = Portfolio;