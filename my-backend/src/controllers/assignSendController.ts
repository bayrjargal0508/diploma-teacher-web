import type { Request, Response } from "express";
import mongoose from "mongoose";
import AssignSend from "../models/AssignmentSend";

export const sendAssign = async (req: Request, res: Response) => {
  try {
    const { assignId, classroomId, studentIds } = req.body;

    // validation
    if (
      !assignId ||
      !classroomId ||
      !Array.isArray(studentIds) ||
      studentIds.length === 0
    ) {
      return res.status(400).json({
        message: "assignId, classroomId, studentIds шаардлагатай",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(assignId) ||
      !mongoose.Types.ObjectId.isValid(classroomId) ||
      studentIds.some(
        (id: string) => !mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return res.status(400).json({
        message: "ObjectId формат буруу байна",
      });
    }

    // duplicate check
    const exists = await AssignSend.findOne({
      assignId,
      classroomId,
    });

    if (exists) {
      return res.status(409).json({
        message: "Энэ даалгавар аль хэдийн илгээгдсэн байна",
      });
    }

    const doc = await AssignSend.create({
      assignId,
      classroomId,
      studentIds,
      sentAt: new Date(),
    });

    res.status(201).json({
      result: true,
      data: doc,
      message: "Даалгавар амжилттай илгээгдлээ",
    });
  } catch (err) {
    console.error("Assign send error:", err);
    res.status(500).json({
      message: "Даалгавар илгээх үед алдаа гарлаа",
    });
  }
};
