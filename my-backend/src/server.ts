import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User";
import ExamQuestion from "./models/ExamQuestion";
import { connectDB } from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/users", async (_, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Exam Questions Route
app.post("/api/exams/questions", async (req, res) => {
  console.log("📌 API called"); // debug

  try {
    await connectDB();

    const { examId, questions } = req.body;

    if (!examId || !questions) {
      return res.status(400).json({
        message: "examId болон questions шаардлагатай",
      });
    }

    await ExamQuestion.deleteMany({ examId });

    const formatted = questions.map((q: any) => ({
      examId,
      question: q.question,
      answers: q.answers,
    }));

    await ExamQuestion.insertMany(formatted);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
});
