const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Product = require("./models/product.model");
const User = require("./models/user.model");
const Feedback = require("./models/feedback.model");

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
    const products = await Product.find(); // Fetch all products from the database
    res.render("shop", { products, user: req.session.userId }); // Pass the products to the index template
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
});

app.get("/product_overview", (req, res) => {
  res.render("product_overview", {});
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

app.post('/add-to-favorites', isAuthenticated, async (req, res) => {
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
  res.render("shopping_cart", {});
});

app.get("/contacts", isAuthenticated, async (req, res) => {
  res.render("contacts", {});
});

// app.get("/admin_panel", (req, res) => {
//     res.render("admin_panel", {});
// });

// 404 page
app.get("*", (req, res) => {
  res.render("404", { user: req.session.userId });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
