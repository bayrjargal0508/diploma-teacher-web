import { NextResponse } from "next/server";
import { connectDB } from "../../../../db";
import ExamQuestion from "../../../../models/ExamQuestion";

export async function POST(req: Request) {
  console.log("📌 API called"); // debug

  try {
    await connectDB();

    const { examId, questions } = await req.json();

    if (!examId || !questions) {
      return NextResponse.json(
        { message: "examId болон questions шаардлагатай" },
        { status: 400 }
      );
    }

    await ExamQuestion.deleteMany({ examId });

    const formatted = questions.map((q: any) => ({
      examId,
      question: q.question,
      answers: q.answers,
    }));

    await ExamQuestion.insertMany(formatted);

    return NextResponse.json(
      { message: "OK" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
