import express from "express";
import {
  createQuestions,
  deleteQuestion,
  getQuestions,
} from "../controllers/examController";
import { createAssign, listAssign } from "../controllers/assignController";

const router = express.Router();

// CREATE questions
router.post("/api/exams/questions", createQuestions);

// GET questions
router.get("/api/exams/questions", getQuestions);

// DELETE question
router.delete("/api/exams/questions/:id", deleteQuestion);

// Assign content/questions
router.post("/api/assignments", createAssign);
router.get("/api/assignments", listAssign);

export default router;
