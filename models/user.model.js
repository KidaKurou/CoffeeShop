const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Store hashed passwords only
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  shoppingCart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    grindType: { type: String, enum: ['В зернах', 'Молотый'], required: true },
    weight: { type: Number, enum: [250, 1000], required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;