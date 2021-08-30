const Review = require('../models/reviews')
const TattooShop = require('../models/tattooShops')
const User = require('../models/user')
const ExpressError = require('../utils/ExpressErrors')

module.exports.getUser = (req,res)=>{
    res.render('users/register')
}

module.exports.registerUser = async (req,res, next)=>{
    try {
    const {email, username, password} = req.body
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password)
    req.login (registeredUser, err => {
        if (err){ return next(err)}
        req.flash('success', 'Welcome to Irezumi Hub!')
        res.redirect('/tattooShops')
    })


}
    catch (e){
        req.flash ('error', e.message)
        res.redirect('register')
    }

}

module.exports.getLogin =  (req, res)=>{
    res.render('users/login')
}

module.exports.login = (req, res)=>{
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/tattooShops'
    res.redirect(redirectUrl)
}

module.exports.logout =  (req, res)=>{
    req.logOut();
    req.flash('success', 'Goodbye!')
    res.redirect('/tattooShops')
}