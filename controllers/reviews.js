const Review = require('../models/reviews')
const TattooShop = require('../models/tattooShops')
const ExpressError = require('../utils/ExpressErrors')

module.exports.newReview = async (req, res, next) =>{
    const tattooShop = await TattooShop.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    tattooShop.reviews.push(review);
    await review.save();
    await tattooShop.save();
    req.flash('success', 'Review Successfully Posted!')
    res.redirect(`/tattooShops/${tattooShop._id}`)
}

module.exports.deleteReview = async (req, res, next) =>{
    const {id, reviewID} = req.params;
    await TattooShop.findByIdAndUpdate(id, {$pull: { reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    console.log (id, reviewID)
    req.flash('success', 'Review Successfully Deleted!')
    res.redirect(`/tattooShops/${id}`)
}