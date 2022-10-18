const passport = require('passport');
const LocalStrategy = require('passport-local');
const {User} = require("../models");
const flash = require('express-flash');

const passportService = (app)=>{
    // Session
    app.use(flash());
    var sessionstore = require('sessionstore');
    app.use(require("express-session")({
        secret: process.env.EXPRESS_SESSION_SECRET,//decode or encode session
            resave: false,          
            saveUninitialized:false,
            store: sessionstore.createSessionStore({type: 'mongodb'})
    }));
    passport.serializeUser(User.serializeUser());       //session encoding
    passport.deserializeUser(function(id, done) {       //email is passed in id by default
        User.findOne({'email':id})
        .populate("role", "-__v").populate("principal", "-__v").populate("school", "-__v")
        .populate('secondaryContact',"-__v")
        .exec(function (err, user) {
            done(err, user);
        });
    });   //session decoding
    passport.use(new LocalStrategy(User.authenticate()));
    app.use(passport.initialize());
    app.use(passport.session());    
}

module.exports = passportService;
