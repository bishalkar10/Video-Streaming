import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import videoRoute from "./routes/video.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Video route
app.use("/video", videoRoute);

// Home route
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
