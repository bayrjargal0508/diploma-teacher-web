import type { Request, Response } from "express";
import Assign from "../models/Assign";

export const createAssign = async (req: Request, res: Response) => {
  try {
    const { contentId, contentName, subject, question, answers, questionType } = req.body;

    if (
      !contentId ||
      !contentName ||
      !subject ||
      !question ||
      !Array.isArray(answers) ||
      !questionType
    ) {
      return res
        .status(400)
        .json({
          message:
            "contentId, contentName, subject, question, answers, questionType шаардлагатай",
        });
    }

    if (!["truefalse", "multiple"].includes(questionType)) {
      return res.status(400).json({ message: "questionType буруу байна" });
    }

    if (answers.length === 0) {
      return res.status(400).json({ message: "Хариулт оруулна уу" });
    }

    const formattedAnswers = answers
      .filter((a: any) => a && typeof a.text === "string")
      .map((a: any) => ({
        text: a.text.trim(),
        isCorrect: Boolean(a.isCorrect),
      }));

    if (formattedAnswers.some((a) => !a.text)) {
      return res.status(400).json({ message: "Бүх хариултын текстийг бөглөнө үү" });
    }

    const hasCorrect = formattedAnswers.some((a) => a.isCorrect);
    if (!hasCorrect) {
      return res
        .status(400)
        .json({ message: "Дор хаяж нэг зөв хариулт сонгоно уу" });
    }

    const saved = await Assign.create({
      contentId,
      contentName,
      subject: subject.trim(),
      questionType,
      question: question.trim(),
      answers: formattedAnswers,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Assign create error:", err);
    res.status(500).json({ message: "Assign хадгалах үед алдаа гарлаа" });
  }
};

export const listAssign = async (_: Request, res: Response) => {
  try {
    const list = await Assign.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    console.error("Assign list error:", err);
    res.status(500).json({ message: "Assign жагсаах үед алдаа гарлаа" });
  }
};

