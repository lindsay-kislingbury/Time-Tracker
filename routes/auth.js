const express = require("express");
const passport = require("passport");
const bodyParser = require('body-parser');
const {check, validationResult} = require("express-validator"); //  TODO: ADD VALIDATION
const {
  logout, 
  dashboard, 
  signup, 
  loginCheck, 
  signupCheck, 
  invalidLogin
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
router.get('/register', signupCheck);
router.post("/signup", signup);
router.post(
    "/login",
    passport.authenticate("local", {
      failureMessage: "Invalid username or password", 
      failureRedirect: "/auth/invalidLogin",
      failureFlash: true
    }),
    loginCheck
);
router.get('/invalidLogin', invalidLogin);


module.exports = router;