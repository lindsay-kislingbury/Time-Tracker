const express = require("express");
const passport = require("passport");
const bodyParser = require('body-parser');
const {check, validationResult} = require("express-validator");

const {login, logout, signup, me} = require("../controller/AuthController");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


// /api/auth/signup
router.post(
    "/signup",
    [
        //Express Validator Options
        check("name")
        .isLength({min: 3})
        .withMessage("the name must have minimum length of 3")
        .trim(),

        check("email")
        .normalizeEmail(),

        check("password")
        .isLength({ min: 4, max: 15 }),

        check("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error("confirm password does not match");
            }
            return true;
          }),
    ],
    (req, res, next) => {
        //Error Handling
        const error = validationResult(req).formatWith(({msg}) => msg);
        const hasError = !error.isEmpty();
        if (hasError){
            res.status(422).json({ error: error.array() });
        }
        else{
            next();
        }
    },
    //Use signup controller
    signup
);


// /auth/login
router.post(
    "/login",
    passport.authenticate("local", {
      failureMessage: "Invalid username or password",
    }),
    login
);

// /api/auth/me
//Used to get the logged in user's info
router.get("/me", me);

module.exports = router;