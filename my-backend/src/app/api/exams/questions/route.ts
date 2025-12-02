import { NextResponse } from "next/server";
import { connectDB } from "../../../../db";
import ExamQuestion from "../../../../models/ExamQuestion";

export async function POST(req: Request) {
  console.log("📌 API called");

  try {
    await connectDB();

    const { examId, questions } = await req.json();

    if (!examId || !questions) {
      return NextResponse.json(
        { message: "examId болон questions шаардлагатай" },
        { status: 400 }
      );
    }

    // хуучин асуултуудыг устгана
    await ExamQuestion.deleteMany({ examId });

    // шинэ асуултуудыг форматлана
    const formatted = questions.map((q: any) => ({
      examId,
      question: q.question,
      answers: q.answers,
    }));

    // mongoDB руу бичих
    await ExamQuestion.insertMany(formatted);

    return NextResponse.json(
      { success: true, message: "Асуултууд амжилттай хадгалагдлаа" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
