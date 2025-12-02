"use client";

import { Button } from "../ui/button";
import { ExamItem } from "@/lib/types";
import { useState } from "react";
import ExamShuffleModal from "../exam/exam-shuffle";
import TeacherCreateExam from "../exam/teacher-create-exam";
import { SidebarTrigger } from "../providers/sidebar-provider";
import TimeIcon from "../icons/time-icon";
import BookQueue from "../icons/book-queue.";
import RocketIcon from "../icons/rocket-icon";
import VariantIcon from "../icons/variant-icon";

interface ExamSidebarProps {
  exam: ExamItem | null;
  Id: string;
  teacherQuestionCount?: number;
  onTeacherQuestionsSaved?: () => void;
}
const ExamSidebar: React.FC<ExamSidebarProps> = ({
  exam,
  Id,
  teacherQuestionCount,
  onTeacherQuestionsSaved,
}: ExamSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTeacherLibOpen, setIsTeacherLibOpen] = useState(false);
  if (!exam) {
    return <div></div>;
  }
  const remainingTeacherQuestions = Math.max(
    0,
    (exam.questionCount ?? 0) - (teacherQuestionCount ?? 0)
  );
  const infoRows = [
    {
      label: "Асуултын тоо",
      value:
        exam.type === "TEACHER_LIBRARY"
          ? remainingTeacherQuestions
          : exam.questionCount,
      icon: <BookQueue size={16} />,
    },
    { label: "Хугацаа", value: exam.duration, icon: <TimeIcon /> },
    { label: "Анги", value: exam.classNumber, icon: <RocketIcon /> },
    { label: "Вариант", value: exam.variantCount, icon: <VariantIcon /> },
  ];
  const questionCount = exam?.questionCount ?? 0;
  const fillCount = exam?.taskCount ?? 0;
  const selectCount = questionCount - fillCount;

  return (
    <aside className="w-[260px] h-full rounded-[10px] bg-background px-4 py-5 flex flex-col justify-between text-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <SidebarTrigger />
          <p className="subTitle">Дэлгэрэнгүй</p>
        </div>

        <div>
          <p className="subTitle">{exam.name}</p>
          <p>{exam.description}</p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {infoRows.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.icon}
                <p className="text-sm">{item.label}</p>
              </div>
              <span className="text-primary font-semibold text-sm px-3 py-0.5">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        {exam.type == "YESH_LIBRARY" && (
          <div className="flex flex-col gap-3">
            <p className="subTitle">Асуултын тоо</p>

            <div className="flex items-center justify-between">
              <p>Сонгох тест</p>
              <span className="text-primary font-semibold text-sm px-3 py-0.5">
                36
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Нөхөх тест</p>
              <span className="text-primary font-semibold text-sm px-3 py-0.5">
                4
              </span>
            </div>
          </div>
        )}
        {exam.type == "SHUFFLE" && (
          <div className="flex flex-col gap-3">
            <p className="subTitle">Асуултын тоо</p>

            <div className="flex items-center justify-between">
              <p>Сонгох тест</p>
              <span className="text-primary font-semibold text-sm px-3 py-0.5">
                {selectCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p>Нөхөх тест</p>
              <span className="text-primary font-semibold text-sm px-3 py-0.5">
                {fillCount}
              </span>
            </div>
          </div>
        )}

        {exam.type == "SHUFFLE" && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setIsOpen(true)}
          >
            Асуулт үүсгэх
          </Button>
        )}
        {exam.type == "TEACHER_LIBRARY" && (
          <Button
            variant="secondary"
            className="w-full"
            disabled={remainingTeacherQuestions <= 0}
            onClick={() => setIsTeacherLibOpen(true)}
          >
            Асуулт нэмэх
          </Button>
        )}
      </div>

      <div className="mt-auto">
        <Button className="w-full">Хадгалах</Button>
      </div>

      <ExamShuffleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        examId={Id}
        examMetaData={exam}
      />
      {isTeacherLibOpen && (
        <TeacherCreateExam
          examId={Id}
          examMetaData={exam}
          onClose={() => setIsTeacherLibOpen(false)}
          onSuccess={() => {
            setIsTeacherLibOpen(false);
            onTeacherQuestionsSaved?.();
          }}
          variant={exam.variantCount}
          questionCount={remainingTeacherQuestions}
          // zasna
          chooseCount={exam.variantCount}
          fillCount={exam.variantCount}
        />
      )}
    </aside>
  );
};

export default ExamSidebar;
