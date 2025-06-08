import mongoose from "mongoose";

const url =
  "mongodb+srv://Valentyna:$uWq3e.X5kRd3Cr@atlascluster.krms0r2.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
await mongoose.connect(url, { dbName: "Japanese" });

// ---------------- SCHEMAS ----------------
const sentenceSchema = new mongoose.Schema({
  text: String,
  expectedAnswer: String,
});

const exerciseSchema = new mongoose.Schema({
  lessonId: mongoose.Schema.Types.ObjectId,
  order: Number,
  sentences: [sentenceSchema],
});

const lessonSchema = new mongoose.Schema({
  unitId: mongoose.Types.ObjectId,
  title: String,
  description: String,
  order: Number,
});

const unitSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
});

// ---------------- MODELS ----------------

const Unit = mongoose.model("Unit", unitSchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

// ---------------- SEED FUNCTION ----------------

async function seed() {
  // 🧹 Clear old data (optional)
  await Unit.deleteMany({});
  await Lesson.deleteMany({});
  await Exercise.deleteMany({});

  const unit = await Unit.create({
    title: "Unit 1: Greetings",
    description: "Learn how to greet people in Japanese",
    order: 1,
  });

  const lesson1 = await Lesson.create({
    unitId: unit._id,
    title: "Lesson 1: Hello",
    description: "Learn to say hello and goodbye",
    order: 1,
  });

  const lesson2 = await Lesson.create({
    unitId: unit._id,
    title: "Lesson 2: How are you?",
    description: "Ask how someone is doing",
    order: 2,
  });

  await Exercise.create({
    lessonId: lesson1._id,
    order: 1,
    example: "v",
    sentences: [
      { text: "Say hello in Japanese.", expectedAnswer: "こんにちは" },
      { text: "Say good morning.", expectedAnswer: "おはようございます" },
      { text: "Say good evening.", expectedAnswer: "こんばんは" },
      { text: "Say goodbye.", expectedAnswer: "さようなら" },
    ],
  });

  // 4️⃣ Create Exercises with Sentences for Lesson 2
  await Exercise.create({
    lessonId: lesson2._id,
    order: 1,
    sentences: [
      { text: "Ask: How are you?", expectedAnswer: "お元気ですか？" },
      { text: "Say: I am fine.", expectedAnswer: "元気です" },
      { text: "Say: Not so well.", expectedAnswer: "あまり元気ではありません" },
      { text: "Say: Thank you.", expectedAnswer: "ありがとう" },
    ],
  });

  console.log("✅ Seeding complete!");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});
