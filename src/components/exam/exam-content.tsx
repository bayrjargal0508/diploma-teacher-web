"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronUp, Edit, Loader2 } from "lucide-react";
import { examVariantQuestions } from "@/actions";
import { ExamDetailType } from "@/lib/types";
import BookQueue from "../icons/book-queue.";
import DeleteIcon from "../icons/delete";
import EmptyExam from "../dashboard/empty-exam";

interface ExamContentProps {
  activeTab: string;
  reloadDone?: () => void;
  examId: string;
}

const ExamContent: React.FC<ExamContentProps> = ({
  activeTab,
  reloadDone,
  examId,
}) => {
  const { id } = useParams();
  const [examData, setExamData] = useState<ExamDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    {}
  );
  const [isReload, setIsReload] = useState(false);

  const fetchExamQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await examVariantQuestions(String(id));
      setExamData(response.data ?? null);

      if (reloadDone) {
        reloadDone();
      }
    } catch (err) {
      setError("Асуултуудыг татахад алдаа гарлаа");
      console.error(err);
    } finally {
      setLoading(false);
      setIsReload(false);
    }
  }, [id, reloadDone]);

  useEffect(() => {
    if (!id) return;
    fetchExamQuestions();
  }, [id, fetchExamQuestions]);

  useEffect(() => {
    if (isReload) fetchExamQuestions();
  }, [isReload, fetchExamQuestions]);

  const getVariantQuestions = () => {
    if (!examData?.variantQuestions) return [];

    const variantIndex = activeTab.charCodeAt(0) - 65;
    return examData.variantQuestions.filter(
      (_, index) => index === variantIndex
    );
  };

  const filtered = getVariantQuestions();
  const filteredQuestions = filtered[0]?.questions || [];
  const filteredTasks = filtered[0]?.tasks || [];

  const answerTypeLabel: Record<string, string> = {
    SELECT: "Сонгох",
    FILL: "Нөхөх",
  };

  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-primary-secondary font-medium">{error}</p>
      </div>
    );

  const isEmpty =
    !examData || (filteredQuestions.length === 0 && filteredTasks.length === 0);

  if (isEmpty)
    return (
      <EmptyExam
        onSuccess={() => setIsReload(true)}
        examId={examId}
        activeTab={activeTab}
      />
    );

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 bg-background-secondary p-2.5 rounded-[10px] mt-5">
      <div className="space-y-4">
        {filteredQuestions.map((question, qIndex) => (
          <div
            key={question.id}
            className="rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5 hover:bg-background cursor-pointer"
            onClick={() => toggleQuestion(question.id)}
          >
            <div className="cursor-pointer flex items-center justify-between gap-2.5">
              <div className="flex gap-2.5">
                <BookQueue className="text-primary" />
                <span className="smallInput text-sm">Асуулт {qIndex + 1}</span>
              </div>

              <div className="flex gap-2.5">
                <Edit
                  size={20}
                  className="text-label-paragraph bg-background rounded-xl w-9 h-9 p-2"
                />
                <DeleteIcon className="text-label-paragraph bg-background rounded-xl w-9 h-9 p-2" />

                {openQuestions[question.id] ? (
                  <ChevronUp
                    size={20}
                    className="bg-background rounded-xl w-9 h-9 p-2"
                  />
                ) : (
                  <ChevronDown
                    size={20}
                    className="bg-background rounded-xl w-9 h-9 p-2"
                  />
                )}
              </div>
            </div>

            {question.questionTextHtml && (
              <div
                dangerouslySetInnerHTML={{ __html: question.questionTextHtml }}
                className="custom-html leading-relaxed mt-2"
              />
            )}

            {question.questionPicUrl && (
              <Image
                src={question.questionPicUrl}
                alt=""
                width={450}
                height={320}
                className="rounded-lg border mt-3"
              />
            )}
            <div className="flex items-center gap-4 text-sm font-medium mt-2">
              <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                Оноо: {question.score}
              </span>
              <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                {answerTypeLabel[question.answerType] ?? question.answerType}
              </span>
              <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                {question.knowledgeLevelName}
              </span>
              <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                {question.contentName}
              </span>
            </div>
            {openQuestions[question.id] && (
              <div className="space-y-2 mt-4">
                {question.questionAnswers
                  .slice()
                  .sort((a, b) => a.answerCode.localeCompare(b.answerCode))
                  .map((answer) => (
                    <div
                      key={answer.id}
                      className="flex items-center gap-3 p-3 rounded-lg"
                    >
                      <span
                        className={`flex items-center justify-center ${
                          answer.correct
                            ? "text-white bg-positive rounded-full w-8 h-8"
                            : "text-[#00A5E3] w-8 h-8"
                        }`}
                      >
                        {answer.answerCode}.
                      </span>

                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            answer.answerTextHtml || answer.answerTextPng || "",
                        }}
                        className="custom-html flex-1"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* TASK */}
        {filteredTasks.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="font-semibold text-lg">Нөхөх хэсэг</h2>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5"
                onClick={() => toggleQuestion(task.id)}
              >
                <div className="cursor-pointer flex items-center justify-between gap-2.5">
                  <div className="flex gap-2.5">
                    <BookQueue className="text-primary" />
                    <p className="font-medium">{task.title}</p>
                  </div>

                  <div className="flex gap-2.5">
                    <Edit
                      size={20}
                      className="text-label-paragraph bg-background rounded-xl w-9 h-9 p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                    <DeleteIcon
                      className="text-label-paragraph bg-background rounded-xl w-9 h-9 p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />

                    {openQuestions[task.id] ? (
                      <ChevronUp
                        size={20}
                        className="bg-background rounded-xl w-9 h-9 p-2"
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="bg-background rounded-xl w-9 h-9 p-2"
                      />
                    )}
                  </div>
                </div>

                {task.instructionHtml && (
                  <div
                    dangerouslySetInnerHTML={{ __html: task.instructionHtml }}
                    className="custom-html mt-2"
                  />
                )}

                <div className="mt-4 space-y-4">
                  {task.questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: q.questionTextHtml || "",
                        }}
                        className="custom-html leading-relaxed"
                      />
                      <div className="flex items-center gap-4 text-sm font-medium mt-2">
                        <span className="px-3 py-1 bg-background rounded-sm">
                          Оноо: {q.score}
                        </span>
                        <span className="px-3 py-1 bg-background rounded-sm">
                          {answerTypeLabel[q.answerType] ?? q.answerType}
                        </span>
                        <span className="px-3 py-1 bg-background rounded-sm">
                          {q.knowledgeLevelName}
                        </span>
                        <span className="px-3 py-1 bg-background rounded-sm">
                          {q.contentName}
                        </span>
                      </div>
                      {openQuestions[task.id] && q.questionAnswers && (
                        <div className="space-y-2 ml-4">
                          {q.questionAnswers
                            .slice()
                            .sort((a, b) =>
                              a.answerCode.localeCompare(b.answerCode)
                            )
                            .map((answer) => (
                              <div
                                key={answer.id}
                                className="flex items-center gap-3 p-3 rounded-lg"
                              >
                                <span
                                  className={`flex items-center justify-center ${
                                    answer.correct
                                      ? "text-white bg-positive rounded-full w-8 h-8"
                                      : "text-[#00A5E3] w-8 h-8"
                                  }`}
                                >
                                  {answer.answerCode}.
                                </span>
                                <p> {answer.correctValue}</p>

                                <div
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      answer.answerTextHtml ||
                                      answer.answerTextPng ||
                                      "",
                                  }}
                                  className="custom-html flex-1"
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamContent;
