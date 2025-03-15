const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/timeTrackerDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

const TimeSchema = new mongoose.Schema({
  url: String,
  timeSpent: Number,
  date: { type: Date, default: Date.now }
});

const TimeModel = mongoose.model("Time", TimeSchema);

// ✅ New API Route for root (`/`)
app.get("/", (req, res) => {
  res.send("Time Tracking API is running 🚀");
});

// API to save time spent on a website
app.post("/save-time", async (req, res) => {
  const { url, timeSpent } = req.body;
  try {
    await TimeModel.create({ url, timeSpent });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

// API to get productivity analytics
app.get("/analytics", async (req, res) => {
  try {
    const data = await TimeModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
