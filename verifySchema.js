const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  // images: Joi.string().required(),
  price: Joi.number().required().min(0),
  description: Joi.string().required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string().required(),
});
