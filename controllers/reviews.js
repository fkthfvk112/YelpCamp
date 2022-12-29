const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Created new reviews");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(req, res)=>{
    const { id, reviewId } = req.params;
    console.log(id, reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews:reviewId} });//$pull 조건에 맞는 요소를 array에서 꺼냄
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted a review');
    res.redirect(`/campgrounds/${id}`);
};