const mongoose = require("mongoose");
const { stringify } = require("qs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    portfolio: [{
        stockTickerSymbol: String,
        stockAvgPrice: Number,
        stockQty: Number
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;