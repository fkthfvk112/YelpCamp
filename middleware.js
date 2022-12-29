const { campgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review')
var bodyParser = require('body-parser');


module.exports.isLoggedIn = async(req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = await req.originalUrl;//세션에 현재 주소 저장
        req.flash('error', 'You must be sigined in')
        return res.redirect('/login');
    }//passport에 의해 req에 자동으로 생성
    next();
}


module.exports.validateCampground = (req, res, next)=>{
    const { error } = campgroundSchema.validate(req.body) //campgroundSchema는 JOi를 활용해 만든 schemas.js를 require
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next)=>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}