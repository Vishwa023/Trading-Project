
var bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    express          = require("express"),
    app              = express(),
    methodOverride   = require("method-override"),
    Stock            = require("./models/stock.js");

mongoose.connect("mongodb://localhost/trading_project", {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('successfully connected with mongoose'))
.catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

/* ---- Used for creating list of stocks ----
let tcsStock = new Stock({
    tickerSymbol: "TCS",
    averagePrice: "1800.33"
});

let wiproStock = new Stock({
    tickerSymbol: "WIPRO",
    averagePrice: "533.44"
});

let relianceStock = new Stock({
    tickerSymbol: "Reliance",
    averagePrice: "1903.44"
});

let infosysStock = new Stock({
    tickerSymbol: "INFY",
    averagePrice: "2000.44"
});

tcsStock.save();
wiproStock.save();
relianceStock.save();
infosysStock.save(); 
*/

app.get('/', function(req, res) {
    res.send("Hello Vishwa");
});

app.get("/stocks", function(req, res){
    Stock.find({}, function(err, allStocks){
        console.log(allStocks);
        if(err){
            console.log("Found Error while listing all Stocks");
        }
        else{
            res.render("list", {stocks : allStocks});
        }
    });
});

app.listen(3000, function(){
    console.log("app is running at 3000");
});