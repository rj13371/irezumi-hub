const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validator, validateReview } = require('../middleware.js');
const Reviews = require('../controllers/reviews')



router.post('/', isLoggedIn, validateReview, catchAsync (Reviews.newReview))

router.delete('/:reviewID', isLoggedIn,catchAsync (Reviews.deleteReview))

module.exports = router;