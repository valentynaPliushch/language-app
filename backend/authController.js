import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URI, { dbName: "Japanese" });

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
