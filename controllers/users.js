const User = require('../models/user');

module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
};

module.exports.register = async(req, res)=>{
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
};

module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
};
module.exports.logIn = (req, res)=>{
    req.flash('success', 'welcome back!');//passport.authenticate는 req에 user._id할당 
    const redirectUrl = req.session.returnTo||'/campgrounds';//error... not work now //session값에 접근 실패하는 이슈 존재(middleware.js)
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            req.flash('error', "logout fail");
            return next(err);
        }
    });// version 6.0에서 synchronous -> asynchronous로 변경됌(https://www.passportjs.org/concepts/authentication/logout/)
    req.flash('success', 'Good Bye !!');//error

    res.redirect('/campgrounds');
};