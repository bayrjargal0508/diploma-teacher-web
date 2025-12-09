"use client";

import { Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  examShuffleKnowledge,
  examShuffleContent,
  ShuffleExam,
} from "@/actions";
import { InputModal } from "../ui/input-modal";
import {
  ExamContent,
  ExamItem,
  ExamKnowledge,
  ShuffleExamPayload,
} from "@/lib/types";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

interface ExamShuffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  examId: string;
  examMetaData?: ExamItem | null;
}

export default function ExamShuffleModal({
  isOpen,
  onClose,
  onSuccess,
  examId,
  examMetaData,
}: ExamShuffleModalProps) {
  const [knowledgeLevels, setKnowledgeLevels] = useState<ExamKnowledge[]>([]);
  const [shuffleContent, setShuffleContent] = useState<ExamContent[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const EXTRA_TASK_KEY = "extra-task";

  const [inputValues, setInputValues] = useState<{
    [key: string]: number | "";
  }>({});

  const totalSelected = Object.values(inputValues)
    .map((v) => (v === "" ? 0 : Number(v)))
    .reduce((sum, v) => sum + v, 0);

  const maxCount = examMetaData?.questionCount ?? 0;

  const isExceed = totalSelected > maxCount;

  useEffect(() => {
    if (
      examMetaData?.questionCount &&
      totalSelected > examMetaData.questionCount
    ) {
      setError("Та нийт боломжит асуултаас олон асуулт оруулсан байна.");
    } else {
      setError("");
    }
  }, [totalSelected, examMetaData?.questionCount]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      try {
        setLoading(true);

        const knowledgeResponse = await examShuffleKnowledge();
        const knowledgeData = Array.isArray(knowledgeResponse.data)
          ? knowledgeResponse.data
          : [];
        const sortedLevels = knowledgeData.sort(
          (a: ExamKnowledge, b: ExamKnowledge) => a.order - b.order
        );
        setKnowledgeLevels(sortedLevels);

        const contentResponse = await examShuffleContent(examId);
        const contentData = Array.isArray(contentResponse.data)
          ? contentResponse.data
          : [];
        setShuffleContent(contentData);
      } catch (error) {
        console.error("Алдаа:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, examId]);

  const handleSubmit = async () => {
    const questionContentCounts: {
      [contentId: string]: {
        contentId: string;
        countByKnowledgeLevel: { [knowledgeId: string]: number };
      };
    } = {};

    shuffleContent.forEach((content) => {
      const contentId = content.id;

      const countByKnowledgeLevel: { [knowledgeId: string]: number } = {};

      knowledgeLevels.forEach((level) => {
        const key = `${contentId}-${level.id}`;

        const rawValue = inputValues[key];
        const value =
          rawValue === "" || rawValue === undefined ? 0 : Number(rawValue);

        if (value > 0) {
          countByKnowledgeLevel[level.id] = value;
        }
      });

      if (Object.keys(countByKnowledgeLevel).length > 0) {
        questionContentCounts[contentId] = {
          contentId,
          countByKnowledgeLevel,
        };
      }
    });

    const extraTaskCount =
      inputValues[EXTRA_TASK_KEY] === "" ||
      inputValues[EXTRA_TASK_KEY] === undefined
        ? 0
        : Number(inputValues[EXTRA_TASK_KEY]);

    const payload: ShuffleExamPayload = {
      questionContentCounts,
      taskCount: extraTaskCount,
    };

    try {
      const res = await ShuffleExam(payload, examId);

      if (res.result) {
        toast.success("Шалгалт амжилттай үүслээ.");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.message || "Алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      toast.error("Сүлжээний алдаа");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      id="popup-modal"
      tabIndex={-1}
      className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-7/10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex gap-2 items-center">
            <Shuffle size={24} />
            Хичээлийн агуулгаар асуулт shuffle хийх
          </h2>
          <button
            title="close"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
        </div>

        <div className="bg-background-secondary p-2.5 rounded-[10px] mb-4 text-sm">
          <div className="flex items-center gap-6  ">
            <p>
              Нийт асуулт:
              <span className="font-semibold">
                {examMetaData?.questionCount}
              </span>
            </p>
            <p>
              Таны сонгосон:
              <span
                className={`font-semibold ${
                  isExceed ? "text-red-600" : "text-green-600"
                }`}
              >
                {totalSelected}
              </span>
            </p>
          </div>
          {error && (
            <p className="text-[#FF6B76] font-medium text-sm mt-1">{error}</p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Уншиж байна ...</div>
        ) : (
          <div>
            {shuffleContent.map((content, cIndex) => (
              <div
                key={cIndex}
                className="grid grid-cols-6 items-center gap-3 py-3 text-sm"
              >
                <span className="col-span-2 text-start">{content.name}</span>

                <div className="flex items-center gap-2 w-full -ml-16">
                  {knowledgeLevels.map((level) => {
                    const key = `${content.id}-${level.id}`;
                    return (
                      <div key={level.id} className="flex gap-1 items-center">
                        <div className="bg-accent w-10 rounded-[10px] py-[5px] px-2.5 flex items-center justify-center">
                          {content.questionCountByKnowledgeLevel?.[level.id] ??
                            0}
                        </div>

                        <InputModal
                          type="number"
                          placeholder={level.name}
                          className="hover:border-primary border w-40"
                          value={
                            inputValues[key] === ""
                              ? ""
                              : String(inputValues[key])
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setInputValues((prev) => ({
                              ...prev,
                              [key]: value === "" ? "" : Number(value),
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex gap-2 items-center justify-end py-5">
              <p className="text-primary">Нөхөх даалгавар</p>

              <InputModal
                type="number"
                placeholder="Нөхөх даалгавар"
                className="hover:border-primary border w-44"
                value={
                  inputValues[EXTRA_TASK_KEY] === ""
                    ? ""
                    : String(inputValues[EXTRA_TASK_KEY] || "")
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValues((prev) => ({
                    ...prev,
                    [EXTRA_TASK_KEY]: value === "" ? "" : Number(value),
                  }));
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <Button variant="secondary" onClick={onClose}>
            Буцах
          </Button>
          <Button
            className="w-[180px]"
            disabled={isExceed}
            onClick={handleSubmit}
          >
            Шалгалтын асуулт үүсгэх
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
