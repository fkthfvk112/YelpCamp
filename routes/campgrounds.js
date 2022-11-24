const express = require('express');
const router = express.Router();

const { modelName } = require('../models/review');
const ExpressError = require('../utils/ExpressError.js');
const catchAsync = require('../utils/catchAsync.js')
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema} = require('../schemas.js');

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

router.get('/', catchAsync(async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', (req, res)=>{//해당 주소일 때, campgorunds/new를 랜더링해서 보여줌
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async(req, res, next) =>{
    //post로 받아온 정보 출력, new.ejs의 form의 action주소와 일치시켜서 작동
        const campgroundSchema = Joi.object({
            campground: Joi.object({
                title: Joi.string().required(),
                price: Joi.number().min(0).required(),
                image: Joi.string().required(),
                location: Joi.string().required(),
                description: Joi.string().required()
            }).required()
        })//valadation확인 용이하게 해주는 라이브러리 JOI
        const result = campgroundSchema.validate(req.body)
        const { error } = result;
        if(error){
            const msg = error.details.map(el => el.message).join(', ');
            throw new ExpressError(msg, 400);
        }
        console.log(result);
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))


router.get('/:id', catchAsync(async(req, res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', catchAsync(async(req, res)=>{//해당 주소로 들어오면
    const campground = await Campground.findById(req.params.id);//해당 id에 맞는 데이터 찾아서
    res.render('campgrounds/edit', {campground});//render처리
}))

router.put('/:id', validateCampground, catchAsync(async(req, res)=>{//require('method-override'); :: from ejs
    const { id } = req.params;//해당 아이디 찾아서
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});//업데이트 수행
    res.redirect(`/campgrounds/${campground._id}`);//수정 후 리다이렉션
}))

router.delete('/:id', catchAsync(async(req, res)=>{//render는 위에서 진행, 여기서는 delete동작 후 redirect만 진행
    //require('method-override'); res.render('campgrounds/show', {campground});
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))



module.exports = router;