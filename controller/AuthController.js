const User = require("../models/User");

const loginCheck = async (req, res) => {
    if(!req.user){
        res.render('index', 
        {
            message: req.flash('error'),
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
        count: count,
        timestamps: userData.timestamps,
    });
}

const logout = (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
};

module.exports = {
    dashboard,
    logout,
    loginCheck,
  };