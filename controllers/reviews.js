const campground = require("../models/campground");
const reviews = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  const review = new reviews(req.body);
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/campground/${camp._id}`);
};

module.exports.deleteReview = async (req, res) => {
  await campground.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewId },
  });
  await reviews.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/campground/${req.params.id}`);
};
