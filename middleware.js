
const { tattooShopSchema, reviewSchema } = require('./schemas.js');
const TattooShop = require('./models/tattooShops')
const ExpressError = require('./utils/ExpressErrors')

module.exports.isLoggedIn = async (req,res,next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please Login');
        return res.redirect('/login')}
        next();
    };

module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const tattooShop = await TattooShop.findById(id);


    if (!tattooShop.author.equals(req.user._id)){
        req.flash ('error', 'You do not have permission to do that!');
        return res.redirect(`/tattooShops/${id}`)
    }
    next();
}

module.exports.validator = (req, res, next) => {
    const { error } = tattooShopSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
