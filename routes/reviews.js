const express = require('express');
const router = express.Router({mergeParams:true});//프리픽스된 주소 내부의 id등을 사용하기 위함

const catchAsync = require('../utils/catchAsync.js')
const { campgroundSchema, reviewSchema} = require('../schemas.js');
const Campground = require('../models/campground');
const Review = require('../models/review');

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

const validateReview = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}


router.post('/', validateReview, catchAsync(async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res)=>{
    const { id, reviewId } = req.params;
    console.log(id, reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews:reviewId} });//$pull 조건에 맞는 요소를 array에서 꺼냄
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;