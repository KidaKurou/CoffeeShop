const path = require("path");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static("assets"));
app.use("/img", express.static("img"));

app.get("/", (req, res) => {
    res.render("index", {});
})

app.get("/shop", (req, res) => {
    res.render("shop", {});
})

app.get("/login", (req, res) => {
    res.render("login", {});
})

app.get("/admin_panel", (req, res) => {
    res.render("admin_panel", {});
})

app.get("/favourite", (req, res) => {
    res.render("favourite", {});
})

app.get("/contacts", (req, res) => {
    res.render("contacts", {});
})

app.get("/product_overview", (req, res) => {
    res.render("product_overview", {});
})

app.get("/shopping_cart", (req, res) => {
    res.render("shopping_cart", {});
})

// 404 page
app.get("*", (req, res) => {
    res.render("404", {});
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})