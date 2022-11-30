var bodyParser = require('body-parser')


module.exports.isLoggedIn = async(req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = await req.originalUrl;//세션에 현재 주소 저장
        req.flash('error', 'You must be sigined in')
        return res.redirect('/login');
    }//passport에 의해 req에 자동으로 생성
    next();
}