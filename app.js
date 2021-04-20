
var apiRoutes         = require("./api-routes"),
    bodyParser        = require("body-parser"),
    connectDB         = require("./connection/db"),
    expressSanitizer  = require("express-sanitizer"),
    express           = require("express"),
    app               = express(),
    methodOverride    = require("method-override");

connectDB();

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