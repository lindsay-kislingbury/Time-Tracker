//Imports
const express = require('express');
const mongoose = require ("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./services/passport");
const AuthRoute = require("./routes/auth");
const TimeRoute = require("./routes/time");
const path = require('path');


//deprecated
mongoose.set('strictQuery', true);

//Database config
const {MONGO_URI, SECRET} = require("./config");

//Port
const PORT = process.env.PORT || 4000;

//Initialize App
const app = express()

//JSON
app.use(express.json());


//Configure Session
app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false}, //secure: true is https
        store: MongoStore.create({mongoUrl: MONGO_URI})
    })
);

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Endpoints
app.use("/auth", AuthRoute);
app.use("/time", TimeRoute);

//Set Views
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views')); 
app.set('view engine', 'ejs')

mongoose
    .connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connected to database"))
    .catch((e) => console.error(e));

//Home Page
app.get('/', function (req, res) {
    res.redirect('/auth');
})

app.listen(4000, '0.0.0.0'), () => {
    console.log(`listening on ${PORT}`)
}