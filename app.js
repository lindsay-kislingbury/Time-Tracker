//Imports
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const express = require('express');
const mongoose = require ("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require("./services/passport");
const AuthRoute = require("./routes/auth");
const TimeRoute = require("./routes/time");
const path = require('path');
mongoose.set('strictQuery', true);

//Database config
const {MONGO_URI, SECRET} = require("./config");
const PORT = process.env.PORT || 4000;
const app = express()
app.use(express.json());

//Connect-Flash
app.use(flash());

//Configure Session
var sessionDay = 86400000;
app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false}, //secure: true is https
        maxAge: sessionDay,
        store: MongoStore.create({mongoUrl: MONGO_URI})
    })
);

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Handle passport deserialize user error
app.use(function(err, req, res, next) {
    if (err) {
        req.logout(function(err){
            if (req.originalUrl == "/") {
            next(); // never redirect login page to itself
            } else {
                res.redirect("/");
            }
        });
        
    } else {
        next();
    }
});

//Endpoints
app.use("/auth", AuthRoute);
app.use("/time", TimeRoute);

//Set Views
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views')); 
app.set('view engine', 'ejs');

mongoose
    .connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connected to database"))
    .catch((e) => console.error(e));

app.get('/', function (req, res) {
    res.redirect('/auth');
});

app.listen(4000, '0.0.0.0'), () => {
    console.log(`listening on ${PORT}`)
}