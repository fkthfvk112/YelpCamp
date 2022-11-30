const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res)=>{
    res.render('users/register');
})

router.post('/register', catchAsync(async(req, res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registerUser = await User.register(user, password); //from passport
        req.login(registerUser, err=>{//from passport
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res)=>{
    res.render('users/login');
})

//https://www.passportjs.org/concepts/authentication/middleware/   (passport 미들웨어 documentation)
router.post('/login', passport.authenticate('local', {falureFlash: true, failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', 'welcome back!');//passport.authenticate는 req에 user._id할당 
    const redirectUrl = req.session.returnTo||'/campgrounds';//error... not work now //session값에 접근 실패하는 이슈 존재
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            req.flash('error', "logout fail");
            return next(err);
        }
    });// version 6.0에서 synchronous -> asynchronous로 변경됌(https://www.passportjs.org/concepts/authentication/logout/)
    req.flash('success', 'Good Bye !!');//error

    res.redirect('/campgrounds');
})

module.exports = router;