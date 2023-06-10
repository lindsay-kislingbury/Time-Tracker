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
            title: "Home"
        });
    }
    else{
        user = req.user;
        userData = await User.findById(user.id);
        count = userData.timestamps.length; 
        res.render('dashboard', 
        {   
            title: 'Dashboard',
            name: userData.name,
            count: count,
            timestamps: userData.timestamps,
        });
    }
};

//Invalid Login 
const invalidLogin = (req, res) => {
    msg = "Incorrect Email or Password";
    res.render('index', 
    {
        message: msg,
        title: "Home"
    });
}


//Get register form
const signupCheck = (req, res) => {
    msg = "valid";
    res.render('index', 
    {
        message: msg,
        title: "Home"
    });
}


//Create user
const signup = async (req, res) => {
    const {username, name, password} = req.body;
    if(req.body.password != req.body.confirmPassword){
        let msg = "confirm password does not match";
        return res.render('index', 
        {
            message: msg,
            title: "Home"
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
        return res.render('index', 
        {
            message: msg,
            title: "Home"
        });
    }
    catch(error){
        msg = "some error occurred";
        return res.render('index', {
            message: msg,
            title: "Home"
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