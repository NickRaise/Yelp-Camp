const campground = require("./models/campground");
const reviews = require("./models/reviews");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./verifySchema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.app.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
  if (result.error)
    throw new ExpressError(result.error.details[0].message, 400);
  else next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You do not have the permisssion to do that!");
    return res.redirect(`/campground/${camp._id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await reviews.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have the permisssion to do that!");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error)
    throw new ExpressError(result.error.details[0].message, 400);
  else next();
};
