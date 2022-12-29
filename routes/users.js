const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
//https://www.passportjs.org/concepts/authentication/middleware/   (passport 미들웨어 documentation)

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {falureFlash: true, failureRedirect: '/login'}), users.logIn);
    
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.get('/logout', users.logOut);

module.exports = router;