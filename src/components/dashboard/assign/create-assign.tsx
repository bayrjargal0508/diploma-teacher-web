"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AnswerTypeDropdown from "./answer-type-dropdown";
import { ExamContent } from "@/lib/types";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import EditorWithToolbar from "@/components/ui/tiptap";

type AnswerState = { text: string; isCorrect: boolean };
interface Types {
  contentItem?: Pick<ExamContent, "id" | "name">;
}
const CreateAssign = ({ contentItem }: Types) => {
  const [subjectText, setSubjectText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [activeTab, setActiveTab] = useState<"subject" | "question" | "answer">(
    "subject"
  );
  const [answerCount, setAnswerCount] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [answerType, setAnswerType] = useState<"truefalse" | "multiple" | null>(
    null
  );

  const router = useRouter();

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

    const trimmedSubject = subjectText.trim();
    const trimmedQuestion = questionText.trim();

    // Validation
    if (!contentItem?.id || !contentItem?.name) {
      setError("Агуулгын мэдээлэл олдсонгүй. Дахин оролдоно уу.");
      return;
    }

    if (!trimmedSubject) {
      setError("Судлах хичээлээ оруулна уу");
      return;
    }

    if (!trimmedQuestion) {
      setError("Асуултаа оруулна уу");
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
          subject: trimmedSubject,
          questionType: answerType,
          question: trimmedQuestion,
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
      setSubjectText("");
      setQuestionText("");
      setAnswers([]);
      setAnswerCount(0);
      setAnswerType(null);
      setError(null);
      
      // Navigate back to assign list after successful save
      setTimeout(() => {
        router.push("/dashboard/assign");
      }, 1000);
    } catch (err) {
      console.error("Assign save error", err);
      setError("Сервертэй холбогдоход алдаа гарлаа.");
      toast.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-between min-h-screen gap-3">
      <div className="bg-background rounded-[10px] p-5 w-full">
        <div className="flex gap-2 mb-4 border-b border-stroke-border">
          <button
            onClick={() => setActiveTab("subject")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "subject"
                ? "text-primary border-b-2 border-primary"
                : "text-label-caption cursor-pointer"
            }`}
          >
            Судлах хичээл
          </button>
          <button
            onClick={() => setActiveTab("question")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "question"
                ? "text-primary border-b-2 border-primary"
                : "text-label-caption cursor-pointer"
            }`}
          >
            Асуулт үүсгэх
          </button>

          <button
            onClick={() => setActiveTab("answer")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "answer"
                ? "text-primary border-b-2 border-primary"
                : "text-label-caption cursor-pointer"
            }`}
          >
            Хариулт үүсгэх
          </button>
        </div>
      
        {activeTab === "subject" && (
          <div className="h-[450px] rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5">
            <p className="subTitle mb-3">Судлах хичээл</p>

            <EditorWithToolbar
              valueHtml={subjectText} 
              onChange={(html) => setSubjectText(html)} 
            />
          </div>
        )}
        {activeTab === "question" && (
          <div className="h-[450px] rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5">
            <p className="subTitle mb-3">Асуулт үүсгэх</p>

            <EditorWithToolbar
              valueHtml={questionText}
              onChange={(html) => setQuestionText(html)}
            />
          </div>
        )}

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

        {activeTab === "answer" && (
          <div className="bg-background-secondary rounded-[10px] p-5 border-[0.6px] border-b-4 border-stroke-border">
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
            <div className="flex flex-col gap-4">
              {answers.map((answer, i) => (
                <div key={i} className="flex gap-2 bg-background-secondary ">
                  <Input
                    placeholder={`Хариулт ${i + 1} оруулна уу`}
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    className="flex-1"
                  />

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
                        <span>Үнэн</span>
                      </label>

                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${i}`}
                          className="size-4"
                          checked={answer.isCorrect === false}
                          onChange={() => handleAnswerCorrect(i, false)}
                        />
                        <span>Худал</span>
                      </label>
                    </div>
                  )}

                  {answerType === "multiple" && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={answer.isCorrect}
                        onCheckedChange={(checked) =>
                          handleAnswerCorrect(i, Boolean(checked))
                        }
                      />
                      <span>Зөв хариулт</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between w-[300px] bg-background rounded-[10px] p-5">
        <Button
          variant="secondary"
          onClick={() => router.push(`/dashboard/assign`)}
        >
          Буцах
        </Button>
        <Button className="w-[120px]" onClick={handleSave} disabled={saving}>
          {saving ? "Хадгалж..." : "Хадгалах"}
        </Button>
      </div>
    </div>
  );
};

export default CreateAssign;
