const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  password: String, // Store hashed passwords only
  shoppingCart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;