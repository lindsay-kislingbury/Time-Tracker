const User = require("../models/User");
let msg = "valid";


const loginCheck = async (req, res) => {
    if(!req.user){
        return res.render('index', {
            message: "valid",
            title: "Home"
            
        });
    }
    else{
        return res.redirect('/auth/dashboard');
    }
};

const dashboard = async(req, res) => {
    if(!req.user){
       return res.redirect('/');
    }
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


const invalidLogin = (req, res) => {
    res.render('index', {
        message: "Incorrect Email or Password",
        title: "Home"
    });
}

const signupCheck = (req, res) => {
    res.render('index', 
    {
        message: "valid",
        title: "Home"
    });
}

const signup = async (req, res) => {
    const {username, name, password} = req.body;
    if(req.body.password != req.body.confirmPassword){
        return res.render('index', {
            message: "confirm password does not match",
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
        return res.render('index', {
            message: "the user with this email already exists",
            title: "Home"
        });
    }
    catch(error){
        return res.render('index', {
            message: "an error occured",
            title: "Home"
        });
    }
};

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
    dashboard,
    logout,
    loginCheck,
    signupCheck,
    invalidLogin
  };