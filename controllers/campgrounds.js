const campground = require("../models/campground");
const {cloudinary} = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  const camps = await campground.find({});
  res.render("campground/index", { camps });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campground/new");
};

module.exports.createCampground = async (req, res, next) => {
  const newCamp = new campground(req.body);
  newCamp.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCamp.author = req.user._id;
  await newCamp.save();
  req.flash("success", "Successfuly added a new campground!");
  res.redirect(`/campground/${newCamp._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const camp = await campground
    .findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot find the campground!");
    res.redirect("/campground");
  } else res.render("campground/show", { camp });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const camp = await campground.findById(id);

  if (!camp) {
    req.flash("error", "Cannot find the campground!");
    return res.redirect("/campground");
  }
  res.render("campground/edit", { camp });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const camp = await campground.findByIdAndUpdate(req.params.id, req.body);
  if (!camp) {
    req.flash("error", "Cannot find the campground!");
    res.redirect("/campground");
  } else {
    const img = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    await camp.images.push(...img);
    camp.save();
    if(req.body.deleteImages) {
      for(let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash("success", "Successfully updated!");
    res.redirect(`/campground/${camp._id}`);
  }
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You do not have the permisssion to do that!");
    return res.redirect(`/campground/${camp._id}`);
  }
  await campground.findByIdAndDelete(req.params.id);
  res.redirect("/campground");
};
