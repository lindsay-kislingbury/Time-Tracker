const User = require("../models/User");

//TODO: ? DO I STILL NEED THIS?
const loginCheck = (req, res) => {
    if(!req.user)
        return res.render('index', {title: "Login"});
    else{
        const name=req.user.name;
        res.render('dashboard', {user: name});
    }
};

const login = (req, res) => {
    const name= req.user.name;
    res.render('dashboard', {user: name});
    //return res.status(200).json({msg: "user successfully logged in"});
};

const signup = async (req, res) => {
    const {username, name, password} = req.body;
    try{
        let user = await User.findOne({username});
        if(!user) {
            let newUser = new User({username, name, password});
            await newUser.save();
            return res.redirect('/');
        }
        //TODO: return alert box instead of json
        return res
            .status(422)
            .json({errors: ["the user with this email already exists"] });
        }
        catch(error){
            console.error(error);
            return res.status(500).json({errors: ["some error occured"] });
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
    login,
    signup,
    logout,
    loginCheck,
  };