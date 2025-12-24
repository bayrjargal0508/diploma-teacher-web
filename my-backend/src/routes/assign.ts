import express from "express";
import mongoose from "mongoose";
import AssignSend from "../models/AssignmentSend";

const router = express.Router();

// POST /api/assignments
router.post("/", async (req, res) => {
  try {
    const { assignId, classroomId, studentIds } = req.body;

    if (!assignId || !classroomId || !Array.isArray(studentIds)) {
      return res.status(400).json({
        result: false,
        message: "Invalid request body",
      });
    }

    if (studentIds.length === 0) {
      return res.status(400).json({
        result: false,
        message: "Student list is empty",
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
        result: false,
        message: "Invalid ObjectId format",
      });
    }

    const exists = await AssignSend.findOne({
      assignmentId: assignId,
      classroomId,
    });

    if (exists) {
      return res.status(409).json({
        result: false,
        message: "Assignment already sent",
      });
    }

    const doc = await AssignSend.create({
      assignmentId: assignId,
      classroomId,
      studentIds,
    });

    return res.status(201).json({
      result: true,
      data: doc,
      message: "Assignment sent successfully",
    });
  } catch (error) {
    console.error("Assignment send error:", error);
    return res.status(500).json({
      result: false,
      message: "Server error",
    });
  }
});

export default router;
