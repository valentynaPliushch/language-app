import fs from "fs/promises";
import mongoose from "mongoose";

const url =
  "mongodb+srv://Valentyna:$uWq3e.X5kRd3Cr@atlascluster.krms0r2.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
await mongoose.connect(url, { dbName: "Japanese" });

// ---------------- SCHEMAS ----------------

const unitSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
});

const wordSchema = new mongoose.Schema({
  unitId: { type: mongoose.Types.ObjectId, ref: "Unit" },
  kanji: String,
  reading: String,
  meaning: String,
  order: Number,
});

// ---------------- MODELS ----------------

const Unit = mongoose.model("Unit", unitSchema);
const Word = mongoose.model("Word", wordSchema);

// ---------------- SEED FUNCTION ----------------

async function seed() {
  let unit = await Unit.findOne({ order: 2 });
  if (!unit) {
    unit = await Unit.create({
      title: "Unit 2",
      order: 2,
    });
  } else {
    await Word.deleteMany({ unitId: unit._id });
    console.log("🗑️ Старі слова видалені");
  }

  const file = await fs.readFile("./backend/wordsUnit18.json", "utf-8");
  const words = JSON.parse(file);

  const wordsToInsert = words.map((word, index) => ({
    ...word,
    unitId: unit._id,
    order: 1 + index,
  }));

  await Word.insertMany(wordsToInsert);

  console.log("✅ Seeding complete!");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});
