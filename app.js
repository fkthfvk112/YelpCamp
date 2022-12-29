if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');//다른 모듈을 사용할 떄 require
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const catchAsync = require('./utils/catchAsync.js')
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');//post, get뿐 아닌 delete put을 가능하게 함
const ejsMate = require('ejs-mate');//ejs-mate는 ejs의 재사용을 도와줌(boilerplate에 사용)https://www.npmjs.com/package/ejs-mate
const Joi = require('joi');
const { nextTick } = require('process');
const ExpressError = require('./utils/ExpressError.js');
const { campgroundSchema, reviewSchema} = require('./schemas.js');
const session = require('express-session');
const flash = require('connect-flash')

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

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
app.use(express.static(path.join(__dirname, 'public' )))
//app.use(morgan('tiny')); //로그를 찍어줌
/*
app.use((req, res, next)=>{
    console.log("practice for next");
    next(); //use는 매순간 실행됨, next를 실행하지 않으면 다음 미들웨어가 실행되지 않음
})
app.use((req, res, next)=>{
    console.log("practice for next2");
    next();//위 use의 next덕에 해당 console.log실행 후, next... 이후 주소에 따라 render진행 가능해짐
})
 */


const sessionConfig={
    secret:"abagfdgsdgsdgdsfg",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24* 7, //쿠키의 만료일자(7일)
        maxAge: 1000 * 60 * 60 * 24* 7,
    }
};

app.use(session(sessionConfig)); //세션사용
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    console.log(session)
    res.locals.currentUser = req.user;//from passport "deserializeUser()" 해당 함수는 매 라우터 요청마다 실행됨
    res.locals.success = req.flash('success');//flash 'success'가 무엇이든지 받아와서 locals의 success키에 저장
    res.locals.error = req.flash('error');
    next();
})//res.locals.success: success를 마치 전역 변수처럼 사용가능하게 됌, 해당 미들웨어 함수가 거친 곳에서 모두 success를 사용가능

app.use("/campgrounds", campgroundsRoutes);//campgrounds로 시작하면 ./routes/campgournds.js의 라우터 함수로 처리
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page not found', 404))
})
app.use((err, req, res, next)=> {//에러 행들링, throw로 던진 에러도 해당 메서드에서 다뤄짐
    const {statusCode = 500, message ='something went wrong' } = err;
    if(!err.message) err.message = "oh error!!!!";
    res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000');
})