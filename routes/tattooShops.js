const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const TattooShop = require('../models/tattooShops')
const { tattooShopSchema, reviewSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validator } = require('../middleware.js');
const tattooShops = require('../controllers/tattooShops')

const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
.get(catchAsync(tattooShops.index))
.post(isLoggedIn, upload.array('image'),catchAsync (tattooShops.postNewShop))

router.get('/new', isLoggedIn, tattooShops.newForm)


router.route('/:id')
.get(catchAsync (tattooShops.getShop))
.put(isLoggedIn,isAuthor, upload.array('image'), catchAsync (tattooShops.editShop))
.delete (isLoggedIn, isAuthor, catchAsync (tattooShops.deleteShop))

router.get('/:id/edit',isLoggedIn, isAuthor , catchAsync (tattooShops.showEditForm))


module.exports = router;