"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Underline, X, Sigma } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatText, FormatType } from "@/lib/formatText";
import { ExamContent } from "@/lib/types";
import AnswerTypeDropdown from "../dashboard/assign/answer-type-dropdown";
import { Checkbox } from "./checkbox";
import { toast } from "react-toastify";

interface Types {
  onClose: () => void;
  contentItem?: Pick<ExamContent, "id" | "name">;
}

type AnswerState = { text: string; isCorrect: boolean };

export default function DocsEditor({ onClose, contentItem }: Types) {
  const [questionText, setQuestionText] = useState("");
  const [activeTab, setActiveTab] = useState<"subject" | "question" | "answer" >("subject");
  const [answerCount, setAnswerCount] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [answerType, setAnswerType] = useState<"truefalse" | "multiple" | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Convert our lightweight markup to HTML before saving
  const toHtml = (text: string) => {
    let html = text;
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/<u>(.*?)<\/u>/g, "<u>$1</u>");
    html = html.replace(/\n/g, "<br />");
    return html;
  };

  const applyFormat = (type: FormatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = questionText.substring(start, end);
    const formatted = formatText(type, selected);

    const newText =
      questionText.substring(0, start) + formatted + questionText.substring(end);
    setQuestionText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formatted.length);
    }, 0);
  };

  const handleAnswerCountChange = (value: number) => {
    setAnswerCount(value);
    setAnswers((prev) => {
      const next = [...prev];
      if (value > prev.length) {
        for (let i = prev.length; i < value; i++) {
          next.push({ text: "", isCorrect: false });
        }
      } else {
        next.length = Math.max(0, value);
      }
      return next;
    });
  };

  const handleAnswerChange = (index: number, text: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text };
      return next;
    });
  };

  const handleAnswerCorrect = (index: number, isCorrect: boolean) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isCorrect };
      return next;
    });
  };

  const handleAnswerTypeChange = (type: "truefalse" | "multiple" | null) => {
    setAnswerType(type);
    if (type === "truefalse") {
      const targetCount = Math.max(2, answerCount || 2);
      handleAnswerCountChange(targetCount);
    } else if (type === "multiple") {
      const targetCount = answerCount === 0 ? 1 : answerCount;
      handleAnswerCountChange(targetCount);
    }
  };

  const handleSave = async () => {
    if (saving) return;

    const trimmedQuestion = questionText.trim();
    if (!trimmedQuestion) {
      setError("Асуултаа оруулна уу");
      return;
    }

    if (!contentItem?.id || !contentItem?.name) {
      setError("Агуулгын мэдээлэл олдсонгүй. Дахин оролдоно уу.");
      return;
    }

    if (!answerType) {
      setError("Хариултын төрлөө сонгоно уу.");
      return;
    }

    if (!answers.length) {
      setError("Хариултын тоог оруулна уу");
      return;
    }

    if (answers.some((a) => !a.text.trim())) {
      setError("Бүх хариултын текстийг бөглөнө үү");
      return;
    }

    if (!answers.some((a) => a.isCorrect)) {
      setError("Дор хаяж нэг зөв хариулт сонгоно уу");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("http://localhost:4000/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: contentItem.id,
          contentName: contentItem.name,
          questionType: answerType,
          question: toHtml(trimmedQuestion),
          answers: answers.map((a) => ({
            text: a.text.trim(),
            isCorrect: a.isCorrect,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Хадгалах үед алдаа гарлаа.");
        return;
      }

      toast.success("Амжилттай хадгалагдлаа");
      setQuestionText("");
      setAnswers([]);
      setAnswerCount(0);
    } catch (err) {
      console.error("Assign save error", err);
      toast.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/50 px-4 w-full">
      <div className="w-[600px] bg-background-secondary p-3 rounded-[10px]">
        <div className="flex items-center justify-between mb-3">
          <p className="h2">Даалгавар үүсгэх</p>
          <X onClick={onClose} className="cursor-pointer hover:text-primary" />
        </div>
        {/* 
        {contentItem && (
          <p className="text-sm text-label-paragraph mb-2">
            Агуулга: {contentItem.name} ({contentItem.id})
          </p>
        )} */}

        {error && (
          <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-700 text-sm">
            {success}
          </div>
        )}

        <div>
          <div className="flex gap-2 mb-4 border-b border-stroke-border">
             <button
              onClick={() => setActiveTab("subject")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "subject"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Судлах хичээл
            </button>
            <button
              onClick={() => setActiveTab("question")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "question"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Асуулт үүсгэх
            </button>

            <button
              onClick={() => setActiveTab("answer")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "answer"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Хариулт үүсгэх
            </button>
          </div>

          {activeTab === "question" && (
            <div className="h-[350px]">
              <p className="subTitle mb-3">Асуулт үүсгэх</p>

              <div className="flex items-center gap-2 p-2 border rounded-md bg-background shadow-sm">
                <button
                  onClick={() => applyFormat("bold")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Bold size={18} />
                </button>

                <button
                  onClick={() => applyFormat("italic")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Italic size={18} />
                </button>

                <button
                  onClick={() => applyFormat("underline")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Underline size={18} />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                  onClick={() => applyFormat("h1")}
                  className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  H1
                </button>

                <button
                  onClick={() => applyFormat("h2")}
                  className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  H2
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                  onClick={() => applyFormat("math")}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Math formula"
                >
                  <Sigma size={18} />
                </button>
              </div>

              <Textarea
                ref={textareaRef}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Энд бичнэ үү..."
                className="mt-3 h-64 border-stroke-border focus:ring-primary bg-background"
              />
            </div>
          )}

          {activeTab === "answer" && (
            <div className="h-[350px] overflow-y-auto">
              <p className="subTitle w-full">Хариулт үүсгэх</p>
              <div className="flex gap-4 my-3 justify-between items-center">
                <Input
                  type="number"
                  placeholder="Хариултын тоо"
                  className="w-52"
                  value={answerCount || ""}
                  onChange={(e) =>
                    handleAnswerCountChange(Math.max(0, Number(e.target.value)))
                  }
                />
                <AnswerTypeDropdown
                  value={answerType}
                  onChange={handleAnswerTypeChange}
                />
              </div>
              {/* Хариултын мөрүүд */}
              <div className="flex flex-col gap-2">
                {answers.map((answer, i) => (
                  <div key={i} className="flex gap-2 border border-stroke-border rounded-md p-2">

                    {/* Хариултын текст */}
                    <Input
                      placeholder={`Хариулт ${i + 1} оруулна уу`}
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      className="flex-1"
                    />

                    {/* TRUE / FALSE хувилбар */}
                    {answerType === "truefalse" && (
                      <div className="flex items-center gap-4 text-sm">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`correct-${i}`}
                            className="size-4"
                            checked={answer.isCorrect === true}
                            onChange={() => handleAnswerCorrect(i, true)}
                          />
                          <span>True</span>
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`correct-${i}`}
                            className="size-4"
                            checked={answer.isCorrect === false}
                            onChange={() => handleAnswerCorrect(i, false)}
                          />
                          <span>False</span>
                        </label>
                      </div>
                    )}

                    {/* MULTIPLE ANSWER хувилбар */}
                    {answerType === "multiple" && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={answer.isCorrect}
                          onCheckedChange={(checked) => handleAnswerCorrect(i, Boolean(checked))}
                        />
                        <span>Correct</span>
                      </div>
                    )}

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

        <div className="flex items-center justify-between mt-3">
          <Button variant="secondary" onClick={onClose}>
            Буцах
          </Button>
          <Button className="w-[120px]" onClick={handleSave} disabled={saving}>
            {saving ? "Хадгалж..." : "Хадгалах"}
          </Button>
        </div>
      </div>
    </div>
  );
}
