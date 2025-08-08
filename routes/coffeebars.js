const express = require('express');
const router = express.Router();
const coffeebars = require('../controllers/coffeebars');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCoffeebar } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(coffeebars.index))
    .post(isLoggedIn, upload.array('image'), validateCoffeebar, catchAsync(coffeebars.createCoffeebar))


router.get('/new', isLoggedIn, coffeebars.renderNewForm)

router.route('/:id')
    .get(catchAsync(coffeebars.showCoffeebar))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCoffeebar, catchAsync(coffeebars.updateCoffeebar))
    .delete(isLoggedIn, isAuthor, catchAsync(coffeebars.deleteCoffeebar))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(coffeebars.renderEditForm))


module.exports = router;