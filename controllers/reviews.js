const Coffeebar = require('../models/coffeebar');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const coffeebar = await Coffeebar.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    coffeebar.reviews.push(review);
    await review.save();
    await coffeebar.save();
    req.flash('success', 'Created new Review');
    res.redirect(`/coffeebars/${coffeebar._id}`);

}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Coffeebar.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/coffeebars/${id}`);
}