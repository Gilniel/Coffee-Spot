const { coffeebarSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Coffeebar = require('./models/coffeebar');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must Log in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCoffeebar = (req, res, next) => {

    const { error } = coffeebarSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const coffeebar = await Coffeebar.findById(id);
    if (!coffeebar.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/coffeebars/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/coffeebars/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body || {});
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}