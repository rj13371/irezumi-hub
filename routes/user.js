const express = require('express');
const router = express.Router({mergeParams:true});
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const local = require('passport-local');
const ExpressError = require('../utils/ExpressErrors')

const Users = require('../controllers/users')

router.route('/register')
.get (Users.getUser)
.post (catchAsync (Users.registerUser))

router.route('/login')
.get(Users.getLogin)
.post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), Users.login)

router.get('/logout',Users.logout)

module.exports = router