const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campground = require("../models/campground");
const campgroundControl = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgroundControl.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundControl.createCampground)
  );

router.get("/new", isLoggedIn, campgroundControl.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgroundControl.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundControl.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundControl.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundControl.renderEditForm)
);

module.exports = router;
