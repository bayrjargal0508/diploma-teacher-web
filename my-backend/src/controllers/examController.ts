import type { Request, Response } from "express";
import ExamQuestion from "../models/ExamQuestion";

// POST - create questions
export const createQuestions = async (req: Request, res: Response) => {
  try {
    const { examId, questions, variant } = req.body;

    const variantNumber =
      typeof variant === "string" ? parseInt(variant, 10) : variant || 1;

    const formattedQuestions = (questions ?? []).map((q: any) => ({
      examId,
      question: q.question,
      score: typeof q.score === "number" ? q.score : Number(q.score) || 0,
      questionType: q.questionType ?? "",
      knowledgeId: q.knowledgeId ?? "",
      contentId: q.contentId ?? "",
      answers: q.answers ?? [],
      variant: variantNumber,
    }));

    const saved = await ExamQuestion.insertMany(formattedQuestions);

    res.status(201).json(saved);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Failed to create questions" });
  }
};

// GET - get questions
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { examId, variant } = req.query;

    const filter: Record<string, unknown> = {};
    if (examId) filter.examId = examId;
    if (variant) filter.variant = Number(variant);

    const list = await ExamQuestion.find(filter);

    res.status(200).json(list);
  } catch (err) {
    console.error("Get error:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

// DELETE - remove single question
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Question id is required" });
    }

    const result = await ExamQuestion.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete question" });
  }
};