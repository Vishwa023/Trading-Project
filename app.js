
var apiRoutes        = require("./api-routes"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    express          = require("express"),
    app              = express(),
    methodOverride   = require("method-override");

mongoose.connect("mongodb://localhost/trading_project", {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('successfully connected with mongoose'))
.catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use('/', apiRoutes);


app.listen(3001, function(){
    console.log("app is running at 3001...");
});