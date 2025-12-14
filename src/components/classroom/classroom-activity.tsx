"use client";
import { classroomActivity } from "@/actions";
import { ClassroomActivity } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ClassroomActivities = ({
  classroomId,
  onStudentAdded,
}: {
  classroomId: string;
  onStudentAdded?: () => void;
}) => {
  const [students, setStudents] = useState<ClassroomActivity[]>([]);
  const [isOpen, setIsOpen] = useState(true);

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
  return (
    <div className="space-y-5 h-[400px] flex flex-col">
      <div
        className="flex justify-between items-center cursor-pointer w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="subTitle leading-5">Ангийн үйл ажиллагаа</p>

        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isOpen && students.length > 0 && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
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
                  <p className="text-sm leading-tight">
                    {activity.student.lastName} {activity.student.firstName}
                  </p>
                  <p className="text-sm leading-tight">
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
    </div>
  );
};

export default ClassroomActivities;
