const mongoose = require('mongoose');
const municipiosPR = require('./municipiosPR');
const { places, descriptors } = require('./seedHelpers')
const Coffeebar = require('../models/coffeebar')

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/coffee-spot');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Coffeebar.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random78 = Math.floor(Math.random() * 79);
        const rate = Math.floor((Math.random() * 5) % 10);
        const spot = new Coffeebar({
            author: '68867eef7034ac681033fbf9',
            location: `${municipiosPR[random78].municipality}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [municipiosPR[random78].longitude, 
                municipiosPR[random78].latitude ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwrjv0ye0/image/upload/v1754241043/CoffeeSpot/a2jrqffda6vs7mdnbqbi.jpg',
                    filename: 'CoffeeSpot/a2jrqffda6vs7mdnbqbi'
                }
            ],
            description: 'Caffe de puerto rico lo mejor',
            rate
        })
        await spot.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});