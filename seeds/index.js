const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
  console.log("Connected to the database");
}
// https://api.unsplash.com/search/photos?query=camping&client_id=X_23L-allNfeYH5PmpfNj5sefhZeDTqeZrg5-tgWx0Q
connectDB().catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const camp = new campground({
      author: "667834566478e3043851a53b",
      location: `${cities[i].City}, ${cities[i].State}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://shorturl.at/HSv88",
      price: 999,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    });
    camp.save();
  }
};

seedDB();
