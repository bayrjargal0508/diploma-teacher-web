import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const assignSchema = new Schema(
  {
    contentId: { type: String, required: true },
    contentName: { type: String, required: true },
    subject: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["truefalse", "multiple"],
      required: true,
      default: "multiple",
    },
    question: { type: String, required: true },
    answers: { type: [answerSchema], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "assignments" }
);

export default (mongoose.models.Assign as mongoose.Model<any>) ||
  mongoose.model("Assign", assignSchema);
