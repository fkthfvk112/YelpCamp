const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');//구조 분해 할당
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async() =>{ //asunc 함수는 promise리턴
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '6385a8f38aeee0ec49212bc2',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://picsum.photos/300/300',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta laudantium eligendi laborum excepturi explicabo perferendis repellat esse quisquam earum incidunt est iste, reiciendis suscipit eum, pariatur neque cumque beatae praesentium.',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('database closed after work');
});