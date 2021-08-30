
const mongoose = require('mongoose');
const TattooShop = require('../models/tattooShops')
const { places, descriptors, imgs } = require('./seedHelpers');
const cities = require('./cities')

mongoose.connect('mongodb://localhost:27017/irezumi-hub', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection open')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await TattooShop.deleteMany({});

    let coordinatesArray = [];

    for (let i = 0;i<10;i++){
        const random250 = Math.floor(Math.random()*250);
        const newTattooShop = new TattooShop({
            author: "61245b3eddb43525560f4e8a",
            location:`${cities[random250].city}, ${cities[random250].admin_name}`,
            geometry: {
              type: "Point",
              coordinates: [parseFloat(cities[random250].lng),parseFloat(cities[random250].lat)]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [ {
                url:
                `${sample(imgs)}`,
                filename: 'tattooExample' }]
        })
    await newTattooShop.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})