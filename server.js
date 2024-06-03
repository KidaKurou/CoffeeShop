const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Product = require("./models/product.model");
const User = require("./models/user.model");
const Feedback = require("./models/feedback.model");
const Cart = require("./models/cart.model");
const Order = require("./models/order.model");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/coffeeshop", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

// Session store
const store = new MongoDBStore({
  uri: "mongodb://localhost/coffeeshop",
  collection: "sessions",
});

// Session configuration
app.use(
  session({
    secret: "bullshit",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static("assets"));
app.use("/img", express.static("img"));

// Middleware for checking if a user is authenticated
app.use(async (req, res, next) => {
  res.locals.user = null;
  if (req.session.userId) {
    res.locals.user = await User.findById(req.session.userId).select(
      "-password"
    );
  }
  next();
});

app.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    let user = null;
    if (req.session.userId) {
      user = await User.findById(req.session.userId).select("-password");
    }
    res.render("index", { products, user });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
});

app.get("/login", async (req, res) => {
  res.render("login", {});
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user._id; // Set the user ID in the session
      res.redirect("/"); // Redirect to the home page after login
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error during login");
  }
});

app.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    "confirm-password": confirmPassword,
  } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.redirect("/login"); // Redirect to the login page after successful registration
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Server error during registration");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out, please try again");
    }
    res.redirect("/login");
  });
});

app.get("/shop", async (req, res) => {
  try {
    const products = await Product.find();
    let user = null;
    if (req.session.userId) {
      user = await User.findById(req.session.userId).select("-password");
    }
    res.render("shop", { products, user: user });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
});

app.get("/favourite", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate("favorites");
    res.render("favourite", { favorites: user.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).send("Server error");
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    let user = null;
    if (!product) {
      return res.status(404).render("404");
    }
    if (req.session.userId) {
      user = await User.findById(req.session.userId).select("-password");
    }
    res.render("product_overview", { product, user });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
});

app.post("/add-to-favorites", isAuthenticated, async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    const index = user.favorites.indexOf(productId);
    if (index === -1) {
      // Add to favorites if not already in the list
      user.favorites.push(productId);
    } else {
      // Remove from favorites if already in the list
      user.favorites.splice(index, 1);
    }
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ success: false });
  }
});

app.get("/shopping_cart", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.userId }).populate(
      "items.product"
    );
    res.render("shopping_cart", { cart });
  } catch (error) {
    console.error("Error fetching shopping_cart:", error);
    res.status(500).send("Server error");
  }
});

app.post("/update-cart-item", async (req, res) => {
  const { itemId, quantity, grindType, weight, currentPrice } = req.body;
  console.log("Current price: " + currentPrice);
  try {
    const cart = await Cart.findOne({ "items._id": itemId });
    if (cart) {
      const item = cart.items.id(itemId);
      if (item) {
        item.quantity = quantity;
        item.grindType = grindType;
        item.weight = weight;
        item.currentPrice = currentPrice;
        await cart.save();
        res.json({ success: true });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Item not found in cart" });
      }
    } else {
      res.status(404).json({ success: false, message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/remove-cart-item", isAuthenticated, async (req, res) => {
  const { itemId } = req.body;
  console.log(itemId);
  try {
    const cart = await Cart.findOne({ user: req.session.userId });
    // Проверяем, существует ли элемент в массиве
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);
    if (itemIndex > -1) {
      // Используем метод 'pull' для удаления элемента по id
      cart.items.pull({ _id: itemId });
      await cart.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ success: false });
  }
});

app.post("/add-to-cart", isAuthenticated, async (req, res) => {
  const { productId, grindType, weight, quantity, currentPrice } = req.body;
  console.log("Product ID: " + productId);
  console.log("Current price: " + currentPrice);
  console.log("Quantity: " + quantity);
  console.log("Grind type: " + grindType);
  console.log("Weight: " + weight);
  try {
    // Найти корзину пользователя или создать новую, если она не существует
    let cart = await Cart.findOne({ user: req.session.userId });
    if (!cart) {
      cart = new Cart({ user: req.session.userId, items: [] });
    }

    // Проверить, есть ли уже такой товар в корзине с такими же параметрами
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.grindType === grindType &&
        item.weight === weight
    );

    if (itemIndex > -1) {
      // Если товар уже есть в корзине, увеличить количество
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Если товара нет, добавить его в корзину
      cart.items.push({
        product: productId,
        grindType,
        weight,
        quantity,
        currentPrice,
      });
    }

    await cart.save();
    res.json({ success: true, message: "Товар добавлен в корзину" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при добавлении товара в корзину",
    });
  }
});

app.get("/contacts", isAuthenticated, async (req, res) => {
  res.render("contacts", {});
});

app.post("/submit-feedback", isAuthenticated, async (req, res) => {
  const { name, email, message } = req.body;
  console.log(name, email, message);
  try {
    let feedback = new Feedback({
      userId: req.session.userId,
      name,
      email,
      message,
    });
    await feedback.save();
    res.json({ success: true, message: "Сообщение отправлено" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ success: false, error: "Failed to submit feedback" });
  }
});

// Route to update user profile
app.post('/updateUserProfile', isAuthenticated, async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    if (user) {
      user.name = name;
      user.email = email;
      user.phone = phone;
      user.address = address;
      await user.save();
      res.json({ success: true, message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Checkout button
app.get('/checkout', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.userId);
  const cart = await Cart.findOne({ user: req.session.userId });
  // if user's cart isn't empty, fill Order collection from user's cart (Order model equals Cart model) with JSON format (FETCH)
  try {
    if (cart && cart.items.length > 0) {
      const order = new Order();
      order.user = user;
      order.items = cart.items;
      await order.save();
      // clear user's cart
      cart.items = [];
      await cart.save();
      res.json({ success: true, message: "Ваш заказ успешно оформлен" });
    }
  }
  catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

// admin panel
app.get("/admin", async (req, res) => {
  const products = await Product.find();
  res.render("admin", { products });
});

app.get("/admin", isAuthenticated, (req, res) => {
  res.render("admin", { user: res.locals.user });
});

app.post("/admin/add-product", isAuthenticated, async (req, res) => {
  const { name, description, price, discount, images, grindType, weight, acidity, density } = req.body;
  console.log(name, description, price, discount, images, grindType, weight, acidity, density);

  // Validate input
  if (!name || !description || !price || !images || !grindType || !weight || !acidity || !density) {
    return res.status(400).send("All fields are required");
  }

  // Save product
  const newProduct = new Product({
    name,
    description,
    price,
    discount,
    images: images.split(','),
    options: {
      grindType,
      weight: Number(weight),
    },
    attributes: {
      acidity: Number(acidity),
      density: Number(density),
    },
  });

  try {
    await newProduct.save();
    res.redirect("/admin");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Error adding product");
  }
});

// Маршрут для удаления продукта
app.delete("/admin/delete-product/:id", async (req, res) => {
  const productId = req.params.id;

  try {
      await Product.findByIdAndDelete(productId);
      res.status(200).json({ message: "Продукт успешно удален." });
  } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      res.status(500).json({ message: "Ошибка при удалении продукта." });
  }
});

// 404 page
app.get("*", (req, res) => {
  res.render("404", { user: req.session.userId });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
