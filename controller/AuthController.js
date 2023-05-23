const User = require("../models/User");
const date = require('date-and-time');
let msg = "valid";


//Check if user is already logged in 
const loginCheck = async (req, res) => {
    if(!req.user){
        msg = "valid";
        return res.render('index', 
        {
            message: msg,
            title: "Login"
        });
    }
    else{
        user = req.user;
        userData = await User.findById(user.id);
        count = userData.timestamps.length; 
        
        console.log("user timestamps: ", count);
        res.render('dashboard', 
        {   
            title: user.title,
            timestamps: user.timestamps
        });
    }
};

//Invalid Login 
const invalidLogin = (req, res) => {
    msg = "Incorrect Email or Password";
    res.render('index', 
    {
        message: msg,
        title: "Login"
    });
}


//Get register form
const signupCheck = (req, res) => {
    msg = "valid";
    res.render('register', 
    {
        message: msg,
        title: "Register"
    });
}

//Create user
const signup = async (req, res) => {
    const {username, name, password} = req.body;
    if(req.body.password != req.body.confirmPassword){
        let msg = "confirm password does not match";
        return res.render('register', 
        {
            message: msg,
            title: "Register"
        });
    }
    try{
        let user = await User.findOne({username});
        if(!user) {
            let newUser = new User({username, name, password});
            await newUser.save();
            return res.redirect('/');
        }
        let msg = "the user with this email already exists"
        return res.render('register', 
        {
            message: msg,
            title: "Register"
        });
    }
    catch(error){
        msg = "some error occurred";
        return res.render('register', {
            message: msg,
            title: "Register"
        });
    }
};

//Logout
const logout = (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
};

module.exports = {
    signup,
    logout,
    loginCheck,
    signupCheck,
    invalidLogin
  };