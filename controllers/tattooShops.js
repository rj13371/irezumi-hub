const TattooShop = require('../models/tattooShops')
const ExpressError = require('../utils/ExpressErrors')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req,res)=>{
    const tattooShops = await TattooShop.find({});
    res.render ('tattooShops/index', {tattooShops})
}

module.exports.newForm = (req, res)=>{
    res.render('tattooShops/new')
}

module.exports.postNewShop = async (req, res, next)=>{
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.tattooShop.location,
        limit: 1
    }).send();

    const tattooShop = new TattooShop(req.body.tattooShop);
    tattooShop.geometry = geoData.body.features[0].geometry
    tattooShop.author = req.user._id;
    tattooShop.images = req.files.map(f => ({url: f.path, filename: f.filename}))    
    await tattooShop.save();
    console.log (tattooShop)
    req.flash('success', 'New Tattoo Shop Posted!!')
    res.redirect(`/tattooShops/${tattooShop._id}`)

}

module.exports.getShop = async (req, res, next)=>{
    const tattooShop = await TattooShop.findById(req.params.id).populate({path: 'reviews', populate:{ path: 'author'}}).populate('author')
    .populate({path: 'appointments', populate:{ path: 'customer'}}).populate('customer')
    .populate({path: 'appointments', populate:{ path: 'tattooArtist'}}).populate('tattooArtist')
    console.log (tattooShop)
    if (!tattooShop) {
        req.flash('error', 'Tattoo Shop Not Found :(')
        next(new ExpressError('invalid shop ID', 404))}
    res.render('tattooShops/show', {tattooShop} );
}

module.exports.showEditForm = async (req, res, next) =>{
    const tattooShop = await TattooShop.findById(req.params.id);
    if (!tattooShop) {
        req.flash('error', 'Tattoo Shop Not Found :(')
        next(new ExpressError('invalid shop ID', 404))}
    res.render('tattooShops/edit', {tattooShop});
}

module.exports.editShop = async (req,res, next)=>{
    const {id} = req.params;
    console.log(req.files);
    const tattooShop = await TattooShop.findByIdAndUpdate(id, {...req.body.tattooShop})
    const imgs = req.files.map (f => ({url: f.path, filename: f.filename}))   
    tattooShop.images.push(...imgs);
    await tattooShop.save();
    req.flash('success', 'Shop Successfully Edited!')
    res.redirect(`/tattooShops/${tattooShop._id}`)
}

module.exports.deleteShop = async (req,res)=>{
    const {id} = req.params;
    const tattooShop = await TattooShop.findByIdAndDelete(id)
    req.flash('success', 'Shop Successfully Deleted!')
    res.redirect(`/tattooShops/`)
}