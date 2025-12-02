import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import BookQueue from "../icons/book-queue.";
import { Textarea } from "../ui/textarea";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
  score: string;
  questionType: string;
  knowledgeId: string;
  contentId: string;
}

interface ExamMetaDataType {
  questionCount: number;
}

interface TeacherCreateExamProps {
  examId: string;
  examMetaData: ExamMetaDataType;
  onClose: () => void;
  onSuccess?: (createdCount: number) => void;
  variant: string | number;
  questionCount?: number;
  chooseCount?: number;
  fillCount?: number;
}

const TeacherCreateExam: React.FC<TeacherCreateExamProps> = ({
  examId,
  examMetaData,
  onClose,
  onSuccess,
  variant,
  questionCount,
  chooseCount,
  fillCount,
}) => {
  const totalQuestions = Math.max(
    1,
    questionCount ?? examMetaData.questionCount
  );

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (
      chooseCount !== undefined &&
      fillCount !== undefined &&
      (chooseCount > 0 || fillCount > 0)
    ) {
      const chooseQuestions = Array.from({ length: chooseCount }, () => ({
        question: "",
        score: "",
        questionType: "choose",
        knowledgeId: "",
        contentId: "",
        answers: Array.from({ length: 4 }, () => ({
          text: "",
          isCorrect: false,
        })),
      }));

      const fillQuestions = Array.from({ length: fillCount }, () => ({
        question: "",
        score: "",
        questionType: "fill",
        knowledgeId: "",
        contentId: "",
        answers: [{ text: "", isCorrect: true }],
      }));

      return [...chooseQuestions, ...fillQuestions];
    }

    return Array.from({ length: totalQuestions }, () => ({
      question: "",
      score: "",
      questionType: "",
      knowledgeId: "",
      contentId: "",
      answers: Array.from({ length: 5 }, () => ({
        text: "",
        isCorrect: false,
      })),
    }));
  });

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], question: value };
      return updated;
    });
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const updatedAnswers = [...updated[questionIndex].answers];
      updatedAnswers[answerIndex] = {
        ...updatedAnswers[answerIndex],
        text: value,
      };
      updated[questionIndex] = {
        ...updated[questionIndex],
        answers: updatedAnswers,
      };
      return updated;
    });
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const updatedAnswers = updated[questionIndex].answers.map((ans, idx) => ({
        ...ans,
        isCorrect: idx === answerIndex,
      }));
      updated[questionIndex] = {
        ...updated[questionIndex],
        answers: updatedAnswers,
      };
      return updated;
    });
  };

  type QuestionMetaKey = "score" | "questionType" | "knowledgeId" | "contentId";

  const handleQuestionMetaChange = (
    index: number,
    field: QuestionMetaKey,
    value: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (submitting) return;

    const hasEmptyQuestion = questions.some(
      (q) => q.question.trim().length === 0
    );

    if (hasEmptyQuestion) {
      setErrorMessage("Бүх асуултын текстийг бөглөнө үү.");
      return;
    }

    const hasEmptyAnswer = questions.some((q) =>
      q.answers.some((a) => a.text.trim().length === 0)
    );

    if (hasEmptyAnswer) {
      setErrorMessage("Бүх хариултуудыг бөглөнө үү.");
      return;
    }

    const everyQuestionHasCorrect = questions.every((q) =>
      q.answers.some((ans) => ans.isCorrect)
    );

    if (!everyQuestionHasCorrect) {
      setErrorMessage(
        "Хэрэв асуулт бүр дээр зөв хариулт сонгосон эсэхээ шалгана уу."
      );
      return;
    }

    const missingKnowledgeOrContent = questions.some(
      (q) => !q.knowledgeId || !q.contentId
    );

    if (missingKnowledgeOrContent) {
      setErrorMessage("Агуулга болон сэдвийг сонгоно уу.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const variantNumber =
        typeof variant === "string"
          ? Number.isNaN(Number(variant))
            ? variant.charCodeAt(0) - 64
            : parseInt(variant, 10)
          : variant;
      const safeVariant =
        typeof variantNumber === "number" && !Number.isNaN(variantNumber)
          ? variantNumber
          : 1;

      const payloadQuestions = questions.map((q) => ({
        ...q,
        score: Number(q.score) || 0,
      }));

      const res = await fetch("http://localhost:4000/api/exams/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          questions: payloadQuestions,
          variant: safeVariant,
        }),
      });

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setErrorMessage(
          (data as { message?: string })?.message ??
            "Асуултыг хадгалах үед алдаа гарлаа."
        );
        return;
      }

      onSuccess?.(questions.length);
      onClose();
    } catch (err) {
      console.error("Request failed:", err);
      setErrorMessage("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-3xl h-[700px] bg-background rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stroke-border">
          <div>
            <h2 className="font-bold text-xl">Шалгалтын асуулт оруулах</h2>
            <p className="text-label-paragraph text-sm mt-1 text-start">
              Вариант: {variant}
            </p>
          </div>
          <button onClick={onClose} className="text-label-paragraph">
            <X size={24} />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-5 mt-4 rounded-md border border-stroke-border px-4 py-2 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-6">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5 hover:bg-background cursor-pointer"
              >
                <div className="mb-4">
                  <div className="flex gap-2.5 pb-4">
                    <BookQueue className="text-primary" />
                    <span className="smallInput text-sm">
                      Асуулт {qIndex + 1}
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm font-medium mt-2 w-full">
                    <Input
                      type="number"
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="Оноо"
                      value={q.score}
                      onChange={(e) =>
                        handleQuestionMetaChange(
                          qIndex,
                          "score",
                          e.target.value
                        )
                      }
                    />

                    {/* <select
                      className="w-full border border-gray-300 p-2 rounded bg-white"
                      value={q.questionType}
                      onChange={(e) =>
                        handleQuestionMetaChange(
                          qIndex,
                          "questionType",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Төрөл</option>
                      <option value="choose">Сонгох</option>
                      <option value="fill">Нөхөх</option>
                    </select> */}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full border border-gray-300 p-2 rounded bg-white text-left">
                          {q.questionType === ""
                            ? "Төрөл"
                            : q.questionType === "choose"
                            ? "Сонгох"
                            : "Нөхөх"}
                        </button>
                      </DropdownMenuTrigger>

                      {/* <DropdownMenuContent
                        side="bottom"
                        align="start"
                        className="w-48 bg-background-secondary p-2 border border-stroke-line rounded-[10px]"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            handleQuestionMetaChange(
                              qIndex,
                              "questionType",
                              "choose"
                            )
                          }
                        >
                          Сонгох
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleQuestionMetaChange(
                              qIndex,
                              "questionType",
                              "fill"
                            )
                          }
                        >
                          Нөхөх
                        </DropdownMenuItem>
                      </DropdownMenuContent> */}
                    </DropdownMenu>
                    <select
                      className="w-full border border-gray-300 p-2 rounded bg-white"
                      value={q.knowledgeId}
                      onChange={(e) =>
                        handleQuestionMetaChange(
                          qIndex,
                          "knowledgeId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Агуулга сонгоно уу</option>
                      <option value="1">Сэргээн санах</option>
                      <option value="2">Ойлгох</option>
                      <option value="3">Хэрэглэх</option>
                      <option value="4">Задлан шинжлэх</option>
                    </select>

                    <select
                      className="w-full border border-gray-300 p-2 rounded bg-white"
                      value={q.contentId}
                      onChange={(e) =>
                        handleQuestionMetaChange(
                          qIndex,
                          "contentId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Сэдэв сонгоно уу</option>
                      <option value="reading">Унших</option>
                      <option value="speaking">Харилцан яриа</option>
                      <option value="grammar">Хэл зүй</option>
                      <option value="morphology">Үг зүй</option>
                      <option value="vocabulary">Үгийн сан</option>
                    </select>
                  </div>
                </div>

                {q.questionType === "choose" ? (
                  // ------------------------- CHOOSE TEST DESIGN -------------------------
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder={`Асуулт ${qIndex + 1}-г оруулна уу`}
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, e.target.value)
                      }
                    />
                    {q.answers.map((ans, aIndex) => (
                      <div key={aIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={ans.isCorrect}
                          onChange={() =>
                            handleCorrectAnswerChange(qIndex, aIndex)
                          }
                          className="w-4 h-4 cursor-pointer"
                        />

                        <Input
                          type="text"
                          className="flex-1 border border-stroke-border p-2 rounded text-sm"
                          placeholder="Хариулт"
                          value={ans.text}
                          onChange={(e) =>
                            handleAnswerChange(qIndex, aIndex, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // ------------------------- FILL TEST DESIGN -------------------------
                  <div className="space-y-4">
                    <Textarea
                      placeholder={`Асуулт ${qIndex + 1}-г оруулна уу`}
                      className="h-32"
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, e.target.value)
                      }
                    />

                    <Textarea
                      placeholder="Зөв хариулт"
                      className="h-32"
                      value={q.answers[0]?.text || ""}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, 0, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-5 border-t border-stroke-border w-full max-w-3xl">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
            className="w-[150px]"
          >
            Цуцлах
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-[150px]"
          >
            {submitting ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreateExam;
