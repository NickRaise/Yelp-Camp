const mongoose = require("mongoose");
const Review = require("./reviews");

const campgroundSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if(doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      }
    })
  }
  console.log(Review);
  
});

module.exports = mongoose.model("Campground", campgroundSchema);
