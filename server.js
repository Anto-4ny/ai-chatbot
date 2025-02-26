const express = require("express");
const path = require("path");

// Initialize express
const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure "views" folder exists

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Sample user data (Replace with real authentication logic)
const sampleUser = { name: "John Doe" };

// Home Page (Registration Page)
app.get("/", (req, res) => res.render("index")); // ✅ Serve "index.ejs"

// Define valid page routes (Remove "index" since it's defined above)
const pages = ["dashboard", "chat", "booking"];

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
