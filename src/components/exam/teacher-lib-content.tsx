"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, AlertCircle, Edit, ChevronUp, ChevronDown } from "lucide-react";
import EmptyExam from "../dashboard/empty-exam";
import BookQueue from "../icons/book-queue.";
import DeleteIcon from "../icons/delete";

type BackendAnswer = {
    text: string;
    isCorrect: boolean;
};

type BackendQuestion = {
    _id: string;
    examId: string;
    question: string;
    score?: number;
    questionType?: string;
    knowledgeId?: string;
    contentId?: string;
    variant?: number;
    answers: BackendAnswer[];
};

interface TeacherLibContentProps {
    examId?: string;
    variant?: string | number;
    refreshKey?: number;
    onCountChange?: (count: number) => void;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
    choose: "Сонгох",
    fill: "Нөхөх",
};

const CONTENT_LABELS: Record<string, string> = {
    reading: "Унших",
    speaking: "Харилцан яриа",
    grammar: "Хэл зүй",
    morphology: "Үг зүй",
    vocabulary: "Үгийн сан",
};

const TeacherLibContent: React.FC<TeacherLibContentProps> = ({
    examId,
    variant,
    refreshKey = 0,
    onCountChange,
}) => {
    const [questions, setQuestions] = useState<BackendQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
        {}
    );
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const variantNumber = useMemo(() => {
        if (variant === undefined || variant === null || variant === "") return undefined;
        if (typeof variant === "number") return variant;
        const code = variant.charCodeAt(0);
        if (!Number.isNaN(Number(variant))) return Number(variant);
        if (!Number.isNaN(code)) {
            // Convert letter (A, B, …) into numeric order (1, 2, …)
            return code - 64;
        }
        return undefined;
    }, [variant]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = new URL("http://localhost:4000/api/exams/questions");
                if (examId) url.searchParams.set("examId", examId);
                if (variantNumber) url.searchParams.set("variant", String(variantNumber));

                const res = await fetch(url.toString(), { signal: controller.signal });
                if (!res.ok) {
                    throw new Error("Failed to fetch questions from backend.");
                }
                const data = await res.json();
                setQuestions(Array.isArray(data) ? data : []);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error(err);
                    setError("Асуултыг татахад алдаа гарлаа. Дахин оролдоно уу.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();

        return () => controller.abort();
    }, [examId, variantNumber, refreshKey]);

    useEffect(() => {
        onCountChange?.(questions.length);
    }, [questions.length, onCountChange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div>
                <EmptyExam
                    onSuccess={() => { }}
                    examId={examId as string}
                    activeTab={variant as string}
                />
            </div>
        );
    }
    const toggleQuestion = (id: string) => {
        setOpenQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const handleDelete = async (
        e: React.MouseEvent<HTMLButtonElement>,
        questionId: string
    ) => {
        e.stopPropagation();
        if (!questionId || deletingId) return;

        const confirmDelete = window.confirm(
            "Энэ асуултыг устгах уу? Дараа нь буцаах боломжгүй."
        );
        if (!confirmDelete) return;

        try {
            setDeletingId(questionId);
            const res = await fetch(
                `http://localhost:4000/api/exams/questions/${questionId}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to delete question");
            }

            setQuestions((prev) =>
                prev.filter((question) => question._id !== questionId)
            );
        } catch (err) {
            console.error(err);
            alert("Асуултыг устгах үед алдаа гарлаа.");
        } finally {
            setDeletingId(null);
        }
    };

    const knowledgeMap: Record<string, string> = {
        "1": "Сэргээн санах",
        "2": "Ойлгох",
        "3": "Хэрэглэх",
        "4": "Задлан шинжлэх",
    };


    return (
        <div className="flex-1 space-y-6 bg-background-secondary p-2.5 rounded-[10px] mt-5">
            {questions.map((question, qIndex) => (
                <div
                    key={question._id ?? `${question.examId}-${qIndex}`}
                    className="rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5 hover:bg-background cursor-pointer"
                    onClick={() => toggleQuestion(question._id)}
                >
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex gap-2.5">
                            <BookQueue className="text-primary" />
                            <span className="smallInput text-sm">Асуулт {qIndex + 1}</span>
                        </div>
                        <div className="flex gap-2.5">
                            <Edit
                                size={20}
                                className="text-label-paragraph bg-background rounded-xl w-9 h-9 p-2"
                            />
                            <button
                                type="button"
                                onClick={(e) => handleDelete(e, question._id)}
                                className="text-label-paragraph bg-background rounded-xl w-9 h-9 p-2 flex items-center justify-center hover:text-destructive"
                                aria-label="Delete question"
                                disabled={deletingId === question._id}
                            >
                                {deletingId === question._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <DeleteIcon />
                                )}
                            </button>

                            {openQuestions[question._id] ? (
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
                    <p className="mt-2 text-base text-foreground font-semibold">{question.question}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium mt-2">
                        <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                            Оноо: {question.score ?? "-"}
                        </span>
                        <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                            {QUESTION_TYPE_LABELS[question.questionType ?? ""] ??
                                (question.questionType || "Төрөл сонгоогүй")}
                        </span>
                        <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                            {knowledgeMap[question.knowledgeId ?? ""] || "Сонгоогүй"}
                        </span>
                        <span className="px-3 py-1 bg-background rounded-sm border-label-caption border">
                            {CONTENT_LABELS[question.contentId ?? ""] ||
                                question.contentId ||
                                "Сонгоогүй"}
                        </span>
                    </div>
                    {openQuestions[question._id] && (
                        <div className="mt-4 space-y-2">
                            {question.answers.map((answer, aIndex) => (
                                <div
                                    key={`${question._id}-answer-${aIndex}`}
                                    className={`rounded-md px-3 py-2 ${answer.isCorrect ? "font-semibold" : ""
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <p className={`text-base  ${answer.isCorrect ? "w-8 h-8 text-background-secondary border border-positive rounded-full flex items-center justify-center bg-positive" : "text-[#00A5E3] pl-3 w-8 h-8"
                                                }`}>
                                            {String.fromCharCode(65 + aIndex)}
                                        </p>
                                        <span
                                            className={`text-base pl-4 ${answer.isCorrect ? "text-positive font-semibold" : ""
                                                }`}
                                        >
                                            {answer.text}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TeacherLibContent;