const express = require("express");
const passport = require("passport");
const bodyParser = require('body-parser');
const {check, validationResult} = require("express-validator"); //  TODO: ADD VALIDATION

//Controller Functions
const {logout, signup, loginCheck, signupCheck, invalidLogin} = require("../controller/AuthController");

//Initalize Router
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static(__dirname + '/public'));


// /#
router.get('/', loginCheck);

// /auth/logout
router.get('/logout', logout);

// /auth/signup
router.get('/register', signupCheck);

router.post("/signup", signup);

// /auth/login
router.post(
    "/login",
    passport.authenticate("local", {
      failureMessage: "Invalid username or password", 
      failureRedirect: "/auth/invalidLogin",
      failureFlash: true
    }),
    // use login controller
    loginCheck
);


//Invalid Login
router.get('/invalidLogin', invalidLogin);


module.exports = router;