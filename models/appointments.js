const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    text: {type: String, required:true },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tattooArtist: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    appointmentDate: {type: Date, required:true },
    appointmentTime: {type: String, required:true, minlength: 5,
        maxlength: 5 }
})

module.exports = mongoose.model('Appointment', appointmentSchema)