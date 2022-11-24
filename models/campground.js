const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

/*
console.log(doc) :

{
  _id: new ObjectId("63637a1718f112f2b22967dc"),
  title: 'Misty Mule Camp',
  image: 'https://picsum.photos/300/300',
  price: 952,
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta laudantium eligendi laborum excepturi explicabo perferendis repellat esse quisquam earum incidunt est iste, reiciendis suscipit eum, pariatur neque cumque beatae praesentium.',
  location: 'Fresno, California',
  __v: 4,
  reviews: [
    new ObjectId("63732741bb9f58bea0e1ef1b"),
    new ObjectId("63732743bb9f58bea0e1ef22"),
    new ObjectId("63732744bb9f58bea0e1ef28"),
    new ObjectId("63732746bb9f58bea0e1ef2e")
  ]

*///mongoose post 미들웨어, await Campground.findByIdAndDelete(id);에서 트리거
CampgroundSchema.post('findOneAndDelete', async function(doc){ 
    if(doc){
        await Review.remove({ //campgorund삭제 후, 해당 데이터베이스 내의 reviews와 매치되는 Review 데이터베이스 삭제
            _id:{//즉, 부모 삭제시 자식들 역시 삭제하는 미들웨어
                $in: doc.reviews 
            }
        })
    }

})


module.exports = mongoose.model('Campground', CampgroundSchema); //모듈을 스코프 밖으로 내보낼 때 module.exports 현재 모듈에 대한 정보를 갖는 객체이다
//model은 DB와 상호작용하기 위한 기본



