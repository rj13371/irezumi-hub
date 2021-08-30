const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validator } = require('../middleware.js');
const Appointments = require('../controllers/appointments')




router.post('/', isLoggedIn, catchAsync (Appointments.newAppointment))

router.delete('/:appointmentID', isLoggedIn,catchAsync (Appointments.deleteAppointment))

module.exports = router;
