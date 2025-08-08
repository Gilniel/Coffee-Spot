const Coffeebar = require('../models/coffeebar');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require('../cloudinary');

module.exports.index = async (rer, res) => {
    const coffeebars = await Coffeebar.find({});
    res.render('coffeebars/index', { coffeebars })
}

module.exports.renderNewForm = (req, res) => {
    res.render('coffeebars/new');
}

module.exports.createCoffeebar = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.coffeebar.location,
        limit: 1
    }).send()
    const coffeebar = new Coffeebar(req.body.coffeebar);
    coffeebar.geometry = geoData.body.features[0].geometry;
    coffeebar.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.log(coffeebar.images);
    coffeebar.author = req.user._id;
    await coffeebar.save();
    req.flash('success', 'Successfully made a new coffeebar!');
    res.redirect(`/coffeebars/${coffeebar._id}`);
}

module.exports.showCoffeebar = async (req, res) => {
    const coffeebar = await Coffeebar.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }

    }).populate('author');
    if (!coffeebar) {
        req.flash('error', 'Coffeebar not found');
        return res.redirect('/coffeebars');
    }

    const user = req.user;
    res.render('coffeebars/show', { coffeebar, msg: req, user })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const coffeebar = await Coffeebar.findById(id);

    if (!coffeebar) {
        req.flash('error', 'Coffeebar not found');
        return res.redirect('/coffeebars');
    }

    req.flash('success', 'Successfully updated coffeebar!');
    res.render('coffeebars/edit', { coffeebar })
}

module.exports.updateCoffeebar = async (req, res) => {
    const { id } = req.params;
    const coffeebar = await Coffeebar.findByIdAndUpdate(id, { ...req.body.coffeebar }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    coffeebar.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await coffeebar.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    coffeebar.save();
    req.flash('success', 'Successfully updated coffeebar!');
    res.redirect(`/coffeebars/${coffeebar._id}`)
}

module.exports.deleteCoffeebar = async (req, res) => {
    const { id } = req.params;
    await Coffeebar.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted coffebAr');
    res.redirect('/coffeebars');

}