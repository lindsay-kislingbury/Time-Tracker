const User = require("../models/User");
let msg = "valid";


const loginCheck = async (req, res) => {
    console.log(req.body);
    if(!req.user){
        msg = "valid";
        return res.render('index', 
        {
            message: msg,
            title: "Home"
            
        });
    }
    else{
        return res.redirect('/auth/dashboard');
    }
};

const dashboard = async(req, res) => {
    user = req.user;
    userData = await User.findById(user.id);
    count = userData.timestamps.length; 
    res.render('dashboard', 
    {   
        title: 'Dashboard',
        name: userData.name,
        timestamps: userData.timestamps,
    });
}

const invalidLogin = (req, res) => {
    msg = "Incorrect Email or Password";
    res.render('index', 
    {
        message: msg,
        title: "Home"
    });
}

const signupCheck = (req, res) => {
    msg = "valid";
    res.render('index', 
    {
        message: msg,
        title: "Home"
    });
}

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