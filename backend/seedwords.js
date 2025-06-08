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
  unitId: mongoose.Types.ObjectId,
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
  const unit = await mongoose.model("Unit").findOne().sort({ order: 1 });

  if (!unit) {
    throw new Error("❌ No units found. Add a Unit before adding words.");
  }
  await Word.create({
    unitId: unit._id,
    kanji: "水",
    reading: "みず",
    meaning: "water",
    order: 1,
  });

  console.log("✅ Seeding complete!");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});
