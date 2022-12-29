const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync.js')
const {isLoggedIn, isAuthor ,validateCampground, validateReview} = require('../middleware')
const multer = require('multer');//이미지 업로드 미들웨어 ...미들웨어->업로드->clodinary
const { storage }  = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.randerNewFrom);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isAuthor, catchAsync(campgrounds.deleteCampgorund));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditFrom));



module.exports = router;