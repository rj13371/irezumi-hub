const Appointment = require('../models/appointments')
const TattooShop = require('../models/tattooShops')
const User = require('../models/user')
const ExpressError = require('../utils/ExpressErrors')

module.exports.newAppointment = async (req, res, next) =>{
    const tattooShop = await TattooShop.findById(req.params.id)
    const appointment = new Appointment(req.body.appointment);

    appointment.customer = req.user._id;
    appointment.tattooArtist = tattooShop.author

    tattooShop.appointments.push(appointment);
    await appointment.save();
    await tattooShop.save();
    console.log (`REQUEST BODY ${req.body.appointment.tattooArtist} REQ PARAMS ${req.params.id} ${appointment}`)
    req.flash('success', 'appointment Successfully Posted!')
    res.redirect(`/tattooShops/${tattooShop._id}`)
}

module.exports.deleteAppointment = async (req, res, next) =>{
    const {id, appointmentID} = req.params;

    await TattooShop.findByIdAndUpdate(id, {$pull: { appointments: appointmentID}});
    await Appointment.findByIdAndDelete(appointmentID);


    req.flash('success', 'Appointment Successfully Deleted!')
    res.redirect(`/tattooShops/${id}`)
}


