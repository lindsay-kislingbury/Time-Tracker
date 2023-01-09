const User = require("../models/User");
let msg = "valid";


//Check if user is already logged in 
const loginCheck = (req, res) => {
    if(!req.user){
        msg = "valid";
        return res.render('index', {message: msg});
    }
    else{
        const name=req.user.name;
        res.render('dashboard', {user: name});
    }
};

//Invalid Login 
const invalidLogin = (req, res) => {
    msg = "Incorrect Email or Password";
    res.render('index', {message: msg});
}


//Logged in dashboard
const login = (req, res, next) => {
    const name= req.user.name;
    res.render('dashboard', {user: name});
};

//Get register form
const signupCheck = (req, res) => {
    msg = "valid";
    res.render('register', {message: msg});
}

//Create user
const signup = async (req, res) => {
    const {username, name, password} = req.body;
    if(req.body.password != req.body.confirmPassword){
        let msg = "confirm password does not match";
        return res.render('register', {message: msg});
    }
    try{
        let user = await User.findOne({username});
        if(!user) {
            let newUser = new User({username, name, password});
            await newUser.save();
            return res.redirect('/');
        }
        let msg = "the user with this email already exists"
        return res.render('register', {message: msg});
    }
    catch(error){
        msg = "some error occured";
        return res.render('register', {message: msg});
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
    login,
    signup,
    logout,
    loginCheck,
    signupCheck,
    invalidLogin
  };