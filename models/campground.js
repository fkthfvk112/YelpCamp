const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema); //모듈을 스코프 밖으로 내보낼 때 module.exports 현재 모듈에 대한 정보를 갖는 객체이다
//model은 DB와 상호작용하기 위한 기본



