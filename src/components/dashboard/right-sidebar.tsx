"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { classroomActivity, totalScore } from "@/actions";
import { useEffect, useState } from "react";
import { ClassroomActivity, StudentExamResult } from "@/lib/types";
import { toast } from "react-toastify";
import Image from "next/image";
import InvitationPopup from "../ui/invitation-popup";
import { SidebarTrigger } from "../providers/sidebar-provider";

const RightSidebar = ({
  invitationCode,
  classroomId,
  onStudentAdded,
  hideInviteButton = false,
  hideInviteScoreBoard = false,
}: {
  invitationCode: string;
  classroomId: string;
  onStudentAdded?: () => void;
  hideInviteButton?: boolean;
  hideInviteScoreBoard?: boolean;
}) => {
  const [students, setStudents] = useState<ClassroomActivity[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [studentsScore, setStudentsScore] = useState<StudentExamResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!classroomId) return;

      const res = await classroomActivity(classroomId);

      if (res.result && Array.isArray(res.data?.list)) {
        setStudents(res.data.list);
        onStudentAdded?.();
      } else {
        toast.error(res.message || "Алдаа гарлаа.");
      }
    };

    fetchData();
  }, [classroomId, onStudentAdded]);

  useEffect(() => {
    const fetchScoreData = async () => {
      if (!classroomId) return;

      const res = await totalScore(classroomId);
      console.log("res", res);

      if (res?.result === true && Array.isArray(res.data)) {
        setStudentsScore(res.data);
      } else {
        toast.error("Алдаа гарлаа. dcdcdc");
      }
    };

    fetchScoreData();
  }, [classroomId]);

  function getRankIcon(index: number) {
    if (index === 0) return "/assets/trophy-gold.png";
    if (index === 1) return "/assets/trophy-silver.png";
    if (index === 2) return "/assets/trophy-bronze.png";
    return "/assets/trophy.png";
  }
  function convertScore(score: number) {
    const minOld = 0;
    const maxOld = 100;

    const minNew = 200;
    const maxNew = 800;

    return Math.round(
      ((score - minOld) / (maxOld - minOld)) * (maxNew - minNew) + minNew
    );
  }

  return (
    <aside className="w-[280px] min-h-screen rounded-[10px] bg-background px-4 py-5 flex flex-col gap-6 text-sm">
      <div className="flex gap-2.5 items-center">
        <SidebarTrigger />
        <p className="subTitle">Сүүлд авсан шалгалт</p>
      </div>
      {!hideInviteButton && (
        <div className="space-y-2.5">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowPopup(true)}
          >
            Ангийн холбоос
          </Button>
          <p className="text-center text-label-caption">
            Ангид шинэ суралцагч урихдаа энэхүү давтагдашгүй холбоосыг
            хуваалцаарай.
          </p>
        </div>
      )}
      {showPopup && (
        <InvitationPopup
          invitationCode={invitationCode}
          classroomId={classroomId}
          onClose={() => setShowPopup(false)}
          onStudentAdded={onStudentAdded}
        />
      )}
      {!hideInviteScoreBoard && (
        <div className="flex flex-col gap-4">
          <p className="subTitle">Онооны самбар</p>

          <div className="border border-stroke-border rounded-[10px] p-4 bg-background-secondary space-y-5">
            {studentsScore.slice(0, 3).map((stu, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2"
              >
                <Image
                  src={getRankIcon(index)}
                  width={24}
                  height={24}
                  alt="rank"
                />
                <p className="text-sm font-semibold text-start truncate w-32">
                  {stu.studentName}
                </p>

                <p className="font-semibold text-label-paragraph text-base">
                  {convertScore(stu.score)}
                </p>
              </div>
            ))}

            <div className="flex items-center justify-center gap-1 cursor-pointer">
              <p
                className="font-bold cursor-pointer"
                onClick={() => {
                  window.history.pushState(null, "", "?tab=2#scoreBoard");
                  const element = document.getElementById("scoreBoard");
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Бүгдийг нь үзэх
              </p>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      )}

      <div
        className="flex gap-2 justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="subTitle">Ангийн үйл ажиллагаа</p>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>
      {isOpen && students.length > 0 && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {students.map((activity) => (
            <div key={activity.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-accent size-9 flex items-center justify-center rounded-full">
                  <Image
                    src={
                      activity.student.gender === "MALE"
                        ? "/assets/photos/male-icon.png"
                        : "/assets/photos/female-icon.png"
                    }
                    alt="gender icon"
                    width={24}
                    height={24}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium leading-tight">
                    {activity.student.lastName} {activity.student.firstName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.createdDate)
                      .toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(",", " /")}
                  </p>
                </div>
              </div>

              <p className="ml-4 border-l-2 border-stroke-border pl-4">
                <span className="text-primary font-semibold text-sm">
                  {activity.content}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
