const express = require('express');//다른 모듈을 사용할 떄 require
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Campground = require('./models/campground');
const methodOverride = require('method-override');//post, get뿐 아닌 delete put을 가능하게 함
const ejsMate = require('ejs-mate');//ejs-mate는 ejs의 재사용을 도와줌

mongoose.connect('mongodb://localhost:27017/yelp-camp');
/* 몽구스 사용법 https://mongoosejs.com/docs/ */
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

/*
템플릿 엔진 사용하려면 아래 두 줄 필요
1. 사용할 템플릿 엔진
2. 템플릿이 있는 디렉토리
*/
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//_dirname 는 main.js(쓰고있는 자바스크립트 파일)의 현재경로, 그 경로에 +/public이라는 뜻

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//app.use(morgan('tiny')); //로그를 찍어줌
/*
app.use((req, res, next)=>{
    console.log("practice for next");
    next(); //use는 매순간 실행됨, next를 실행하지 않으면 다음 미들웨어가 실행되지 않음
})
app.use((req, res, next)=>{
    console.log("practice for next2");
    next();//위 use의 next덕에 해당 consle실행 후, next... 이후 주소에 따라 render진행 가능해짐
})
*/


app.get('/', (req, res)=>{
    res.render('home');//서버가 home을 랜더링하여 response하겠다는 것. route함수.
    // 도메인 주소 값이 해당 함수의 값과 일치하면 실행됌
    }
)
app.get('/campgrounds', async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}
)

app.get('/campgrounds/new', (req, res)=>{//해당 주소일 때, campgorunds/new를 랜더링해서 보여줌
    res.render('campgrounds/new');
})

app.post('/campgrounds', async(req, res) =>{
    //post로 받아온 정보 출력, new.ejs의 form의 action주소와 일치시켜서 작동
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id', async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
})

app.get('/campgrounds/:id/edit', async(req, res)=>{//해당 주소로 들어오면
    const campground = await Campground.findById(req.params.id);//해당 id에 맞는 데이터 찾아서
    res.render('campgrounds/edit', {campground});//render처리
})

app.put('/campgrounds/:id', async(req, res)=>{//require('method-override'); :: from ejs
    const { id } = req.params;//해당 아이디 찾아서
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});//업데이트 수행
    res.redirect(`/campgrounds/${campground._id}`);//수정 후 리다이렉션
})

app.delete('/campgrounds/:id', async(req, res)=>{//render는 위에서 진행, 여기서는 delete동작 후 redirect만 진행
    //require('method-override'); res.render('campgrounds/show', {campground});
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000');
})