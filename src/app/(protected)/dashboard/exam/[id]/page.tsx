"use client";
import ExamSidebar from "@/components/dashboard/exam-sidebar";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { examMetadata } from "@/actions";
import { ExamItem } from "@/lib/types";
import ExamContent from "@/components/exam/exam-content";
import TeacherLibContent from "@/components/exam/teacher-lib-content";

type TabType = "A" | "B" | "C" | string;

const ExamDetailPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("A");
  const [examMetaData, setExamMetaData] = useState<ExamItem | null>(null);
  const [teacherQuestionCount, setTeacherQuestionCount] = useState(0);
  const [teacherLibRefreshKey, setTeacherLibRefreshKey] = useState(0);
  const { id: examId } = useParams();

  const fetchExam = useCallback(async () => {
    try {
      const res = await examMetadata();
      if (res.data) {
        const foundExam =
          "list" in res.data
            ? res.data.list.find((item) => item.id === id)
            : res.data;

        if (foundExam) {
          setExamMetaData(foundExam);
        }
      }
    } catch (error) {
      console.error("Алдаа гарлаа:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      await fetchExam();
    };

    load();
  }, [id, searchParams, fetchExam]);

  return (
    <div>
      <div className="flex gap-2.5">
        <div className="flex-1 bg-background rounded-[10px] flex flex-col p-5">
          <div className="flex border-b border-stroke-border">
            {Array.from({ length: examMetaData?.variantCount ?? 0 }, (_, i) =>
              String.fromCharCode(65 + i)
            ).map((variant) => (
              <button
                key={variant}
                onClick={() => setActiveTab(variant)}
                className={`px-6 py-3 text-sm font-medium transition-all ${activeTab === variant
                    ? "border-b-2 border-primary text-primary subTitle"
                    : "text-muted-foreground hover:text-primary subTitle"
                  }`}
              >
                {variant} Вариант
              </button>
            ))}
          </div>

          {["SHUFFLE", "YESH_LIBRARY"].includes(
            examMetaData?.type ?? ""
          ) && (
          <div className="flex flex-1 items-center justify-center">
            <ExamContent activeTab={activeTab} examId={examId as string} />
          </div>
          )}

          {examMetaData?.type === "TEACHER_LIBRARY" && (
          <div className="flex flex-1 items-center justify-center">
              <TeacherLibContent
                examId={examId as string}
                variant={activeTab}
                refreshKey={teacherLibRefreshKey}
                onCountChange={setTeacherQuestionCount}
              />
          </div>
          )}
        </div>

        <div className="h-[calc(100vh-98px)] sticky top-[88px]">
          <ExamSidebar
            exam={examMetaData}
            Id={String(id)}
            teacherQuestionCount={teacherQuestionCount}
            onTeacherQuestionsSaved={() =>
              setTeacherLibRefreshKey((prev) => prev + 1)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
