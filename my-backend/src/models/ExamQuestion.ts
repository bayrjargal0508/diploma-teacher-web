import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new Schema({
  examId: { type: String, required: true },
  question: { type: String, required: true },
  score: { type: Number, default: 0 },
  questionType: { type: String, default: "" },
  knowledgeId: { type: String, default: "" },
  contentId: { type: String, default: "" },
  variant: { type: Number, default: 1 },
  answers: { type: [answerSchema], required: true },
});

export default (mongoose.models.ExamQuestion as mongoose.Model<any>) ||
  mongoose.model("ExamQuestion", questionSchema);
