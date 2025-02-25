const express = require("express");
const path = require("path");

// Initialize express
const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Use __dirname instead of process.cwd() for better stability

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Sample user data (Replace with real authentication logic)
const sampleUser = { name: "John Doe" };

// Routes
const pages = ["dashboard", "earnings", "help", "validator", "referral", "withdraw", "profile"];

// Home Page (Registration Page)
app.get("/", (req, res) => res.render("index"));

// Redirect /index to /
app.get("/index", (req, res) => res.redirect("/"));

// Generate dynamic routes for all pages
pages.forEach((page) => {
    app.get(`/${page}`, (req, res) => {
        res.render(page, { user: sampleUser.name });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
