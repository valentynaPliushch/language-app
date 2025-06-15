// models.js
import mongoose from "mongoose";

// --- SCHEMAS ---
const unitSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
});

const lessonSchema = new mongoose.Schema({
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
  },
  title: String,
  order: Number,
});

const wordSchema = new mongoose.Schema({
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
  },
  kanji: String,
  reading: String,
  meaning: String,
  order: Number,
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// --- MODELS ---
const Unit = mongoose.model("Unit", unitSchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Word = mongoose.model("Word", wordSchema);
const User = mongoose.model("User", userSchema);

export { Lesson, Unit, User, Word };
