import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new Schema({
  examId: { type: String, required: true },
  question: { type: String, required: true },
  answers: { type: [answerSchema], required: true },
});

export default mongoose.models.ExamQuestion ||
  mongoose.model("ExamQuestion", questionSchema);
