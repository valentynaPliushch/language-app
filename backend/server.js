import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect(process.env.MONGODB_URI, { dbName: "Japanese" });

const lessonSchema = new mongoose.Schema({
  title: String,
  order: Number,
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
  },
});

const wordSchema = new mongoose.Schema({
  unitId: mongoose.Types.ObjectId,
  kanji: String,
  reading: String,
  meaning: String,
  order: Number,
});

const Lesson = mongoose.model("Lesson", lessonSchema);
const Word = mongoose.model("Word", wordSchema);

// API route
app.get("/lessons", async (req, res) => {
  const lessons = await Lesson.find().sort({ order: 1 });
  res.json(lessons);
});

app.post("/words", async (req, res) => {
  try {
    const { unitId, kanji, reading, meaning } = req.body;

    // Count how many words are already in this unit
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
    console.error("❌ Error creating word:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);
