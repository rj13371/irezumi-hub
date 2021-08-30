const mongoose = require('mongoose');
const Review = require('./reviews')
const Appointment = require('./appointments')
const Schema = mongoose.Schema;

const tattooShopSchema = new Schema({
    title: {type: String, required:true },
    description: {type: String},
    location: {type: String, required:true },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images: [{
        url: String,
        filename: String
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref:('User')
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref:('Review')
    }],
    appointments: [{
        type: Schema.Types.ObjectId,
        ref:('Appointment')
    }]
})



tattooShopSchema.post('findOneAndDelete' , async function (doc){
    if (doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        }) 
    }
})

module.exports = mongoose.model('TattooShop', tattooShopSchema)

