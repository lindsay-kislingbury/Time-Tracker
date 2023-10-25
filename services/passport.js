const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");
const { v4: uuidv4 } = require('uuid');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id, "name email");
    if (!user) return done(new Error("user not found"));
    return done(null, user);
  } 
  catch (error) {
    console.error(error);
    done(error);
  }
});

passport.use('local-login', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({"username": username});
        if (!user) return done(null, false, {message: 'Incorrect Username or Password'});
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) return done(null, false, {message: 'Incorrect Username or Password'});
        return done(null, user);
      } 
      catch (err) {
        return done(err);
      }
    }
  )
);

passport.use('local-signup', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const name = req.body.name;
      const confirmPassword = req.body.confirmPassword;
      if(password != confirmPassword){
        return(done, null, false, {message: 'Confirm Password Does Not Match'})
      }
      try {
        var newUser;
        const user = await User.findOne({"username": username});
        if (user) return done (null, false, {message: 'A User With This Email Already Exists'})
        newUser = new User({username, name, password});
        await newUser.save();
        return done(null, newUser);
      } 
      catch (err) {
        return done(err);
      }
    }
  )
);

passport.use('local-temp-signup', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const name = req.body.name;
      const id = uuidv4();
      try {
        var newUser = new User({
          username: id,
          name: name,
          password: password,
          expireAt: new Date(Date.now() + 86400000), //1 day
        });
        await newUser.save();
        return done(null, newUser);
      } 
      catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;