const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discount: Number,
  images: [String],
  options: {
    grindType: String,
    weight: Number,
  },
  attributes: {
    acidity: Number,
    density: Number,
  },
  ratings: [ratingSchema],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;