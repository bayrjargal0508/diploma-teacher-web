import express from "express";
import {
  createQuestions,
  deleteQuestion,
  getQuestions,
} from "../controllers/examController";

const router = express.Router();

// CREATE questions
router.post("/api/exams/questions", createQuestions);

// GET questions
router.get("/api/exams/questions", getQuestions);

// DELETE question
router.delete("/api/exams/questions/:id", deleteQuestion);

export default router;
