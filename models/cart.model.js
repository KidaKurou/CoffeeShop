const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  grindType: { type: String, enum: ["В зернах", "Молотый"], required: true },
  weight: { type: Number, enum: [250, 1000], required: true },
  quantity: { type: Number, required: true, min: 1 },
  currentPrice: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;