const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");

// User router
const user = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: "secrets", saveUninitialized: false, resave: false}));

// Serve static resources
app.use("/public", express.static("public"));

//set hbs engine 
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: null}));
app.set("views", __dirname + "/views");
app.set('view engine', 'hbs');

// Initiate API
app.use("/", user);

const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log("Connected to port " + port);
});