import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
}

interface ExamMetaDataType {
  questionCount: number;
  // шаардлагатай бол бусад property-оо нэмж болно
}

interface TeacherCreateExamProps {
  examId: string;
  examMetaData: ExamMetaDataType;
  onClose: () => void;
  onSuccess?: () => void;
}

const TeacherCreateExam: React.FC<TeacherCreateExamProps> = ({
  examId,
  examMetaData,
  onClose,
  onSuccess,
}) => {
  // ✅ Lazy initialization - асуулт бүр 5 хариулттай
  const [questions, setQuestions] = useState<Question[]>(() =>
    Array.from({ length: examMetaData.questionCount }, () => ({
      question: "",
      answers: Array.from({ length: 5 }, () => ({
        text: "",
        isCorrect: false,
      })),
    }))
  );

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

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/exams/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          questions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data);
        return;
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Request failed:", err);
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
      <div className="w-full max-w-3xl h-[700px] bg-background-secondary rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-bold text-xl">Шалгалтын асуулт оруулах</h2>
            <p className="text-gray-600 text-sm mt-1">Exam ID: {examId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-6">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                {/* Асуулт */}
                <div className="mb-4">
                  <label className="text-sm font-semibold mb-2 block">
                    Асуулт {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Асуулт ${qIndex + 1}-г оруулна уу`}
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                  />
                </div>

                {/* Хариултууд */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Хариултууд (зөв хариултыг сонгоно уу):
                  </p>
                  {q.answers.map((ans, aIndex) => (
                    <div key={aIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={ans.isCorrect}
                        onChange={() =>
                          handleCorrectAnswerChange(qIndex, aIndex)
                        }
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Хариулт ${aIndex + 1}`}
                        value={ans.text}
                        onChange={(e) =>
                          handleAnswerChange(qIndex, aIndex, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t">
          <Button variant="secondary" onClick={onClose}>
            Цуцлах
          </Button>
          <Button onClick={handleSubmit}>Хадгалах</Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreateExam;
