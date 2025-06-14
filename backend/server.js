import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Lesson, Unit, User, Word } from "./models.js";
// import authMiddleware from "./middleware";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI, { dbName: "Japanese" });

const Lesson = mongoose.model("Lesson", lessonSchema);
const Word = mongoose.model("Word", wordSchema);
const User = mongoose.model("User", userSchema);
const Unit = mongoose.model("Unit", unitSchema);

app.get("/lessons", async (req, res) => {
  const lessons = await Lesson.find().sort({ order: 1 });
  res.json(lessons);
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(401).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Email not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/words", async (req, res) => {
  try {
    const { unitId, kanji, reading, meaning } = req.body;
    const count = await Word.countDocuments({ unitId });
    const order = count + 1;

    const newWord = await Word.create({
      unitId,
      kanji,
      reading,
      meaning,
      order,
    });
    res.status(201).json(newWord);
  } catch (err) {
    console.error("Error creating word:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/words", async (req, res) => {
  try {
    const words = await Word.find().sort({ order: 1 });
    res.json(words);
  } catch (err) {
    console.error("❌ Failed to fetch words:", err);
    res.status(500).json({ error: "Failed to get words" });
  }
});

// app.get("/profile", authMiddleware, (req, res) => {
//   res.json({ message: "Welcome!" });
// });

app.get("/units", async (req, res) => {
  try {
    const units = await Unit.find().sort({ order: 1 });
    res.json(units);
  } catch (err) {
    console.error("❌ Failed to fetch units:", err);
    res.status(500).json({ error: "Failed to get units" });
  }
});

app.listen(3000, () => console.log("Server running"));
