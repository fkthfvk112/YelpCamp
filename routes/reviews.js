const express = require('express');
const router = express.Router({mergeParams:true});//프리픽스된 주소 내부의 id등을 사용하기 위함

const catchAsync = require('../utils/catchAsync.js')
const { campgroundSchema, reviewSchema} = require('../schemas.js');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');

const validateCampground = (req, res, next)=>{
    const { error } = campgroundSchema.validate(req.body) //campgroundSchema는 JOi를 활용해 만든 schemas.js를 require
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;