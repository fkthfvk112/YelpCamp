//C of MVC prattern 

const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeooding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeooding({accessToken: mapBoxToken});

module.exports.index = async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.randerNewFrom = (req, res)=>{//해당 주소일 때, campgorunds/new를 랜더링해서 보여줌
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    //post로 받아온 정보 출력, new.ejs의 form의 action주소와 일치시켜서 작동
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));//from multer
    campground.author = req.user._id;//req.usr : passport에 의해 자동 생성
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampgrounds = async(req, res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{//nested populate, 각 reviews를 populate한다.
            path: 'author'
        }
    }).populate('author');//campground의 populate
    console.log(campground);
    if(!campground){
        req.flash('error', 'Cannot find campground!!');
        return res.redirect('/camgrounds');
    }
    res.render('campgrounds/show', {campground});
};

module.exports.renderEditFrom = async(req, res)=>{//해당 주소로 들어오면
    const campground = await Campground.findById(req.params.id);//해당 id에 맞는 데이터 찾아서
    if(!campground){
        req.flash('error', 'there are no such campground');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', {campground});//render처리
};

module.exports.updateCampground = async(req, res)=>{//require('method-override'); :: from ejs
    const { id } = req.params;//해당 아이디(캠프아이디) 찾아서
    console.log("ㄹㄴㅇㄹㄴㅁㄹㅇㄴㄹ");
    console.log(req.body);
    const campground = await Campground.findById(id);//존재 확인
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);//delte from cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: {$in: req.body.deleteImages } } } });//delete from mongo
        console.log(campground);
    }
    req.flash('success', 'Successfully updated campgrounds');
    res.redirect(`/campgrounds/${campground._id}`);//수정 후 리다이렉션
};

module.exports.deleteCampgorund = async(req, res)=>{//render는 위에서 진행, 여기서는 delete동작 후 redirect만 진행
    //require('method-override'); res.render('campgrounds/show', {campground});
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted a campground');
    res.redirect('/campgrounds');
};