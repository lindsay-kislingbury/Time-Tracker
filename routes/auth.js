const express = require("express");
const passport = require("passport");
const bodyParser = require('body-parser');
const {check, validationResult} = require("express-validator"); //  TODO: ADD VALIDATION
const {
  logout, 
  dashboard, 
  loginCheck, 
} = require("../controller/AuthController");

//Initalize Router
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static(__dirname + '/public'));


//Routes
router.get('/', loginCheck);
router.get('/dashboard', dashboard);
router.get('/logout', logout);
router.all("/login", 
  passport.authenticate("local-login", {
    successRedirect: '/auth/dashboard',
    failureRedirect: '/',
    failureFlash: true,
  })
);
router.all("/signup",
  passport.authenticate("local-signup", {
    successRedirect: '/auth/dashboard',
    failureRedirect: '/',
    failureFlash: true,
  })
);
router.all("/tempSignup", 
  passport.authenticate("local-temp-signup", {
    successRedirect: '/auth/dashboard',
  })
);


module.exports = router;