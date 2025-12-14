import Image from "next/image";
import { notFound } from "next/navigation";
import { getStudents } from "@/actions";
import { Student } from "@/lib/types";
import { Check, Dot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentDetail from "@/components/classroom/student-detail";
import ClassroomActivities from "@/components/classroom/classroom-activity";

interface StudentsApiResponse {
  result: boolean;
  data?: {
    list: Array<{
      id: string;
      classroomId: string;
      student: Student;
    }>;
  };
  message?: string;
}

interface StudentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ classroomId?: string }>;
}

export default async function StudentPage({
  params,
  searchParams,
}: StudentPageProps) {
  const { id: studentId } = await params;
  const { classroomId } = await searchParams;

  if (!classroomId) return notFound();

  const response = (await getStudents(classroomId)) as StudentsApiResponse;

  if (!response?.result || !response.data) return notFound();

  const students = response.data.list;
  const studentData = students.find((s) => String(s.student.id) === studentId);

  if (!studentData) return notFound();

  const student = studentData.student;

  return (
    <div className="flex gap-2.5">
      <div className="min-w-[300px] shrink-0 bg-background rounded-[10px] p-4 pb-10 h-full">
        <div className="flex flex-col items-center gap-4 justify-start pt-9">
          <div className="rounded-full bg-accent p-4 flex items-center justify-center size-[120px]">
            <Image
              src={
                student.gender === "FEMALE"
                  ? "/assets/photos/logo/female-icon.png"
                  : "/assets/photos/logo/male-icon.png"
              }
              width={80}
              height={80}
              alt="profile"
            />
          </div>
          <div className="text-center">
            <p className="font-semibold">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-label-paragraph text-sm">{student.email}</p>
          </div>
          {student.premium ? (
            <span className="flex items-center gap-1 bg-[#DBF4E6] text-[#41C993] border border-[#41C993] px-3.5 py-1 rounded-full text-[12px] w-fit">
              <Dot className="w-5 h-5" />
              Эрхтэй
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-primary-tertiary text-[#CF4D5B] border border-[#E5606A] px-3.5 py-1 rounded-full text-[12px] w-fit">
              <Dot className="w-5 h-5" />
              Эрхгүй
            </span>
          )}
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-positive size-5 rounded-full flex items-center justify-center">
              <Check className="text-background-secondary  " size={15} />
            </div>
            <span>
              {student.score} / {student.maxScore} Шалгалт
            </span>
          </div>
          <Button className="w-full">
            <Plus /> Даалгавар өгөх
          </Button>
          <ClassroomActivities classroomId={classroomId} />
        </div>
      </div>
      <div className="w-full p-5 bg-background rounded-[10px] px-5">
        <StudentDetail classroomId={classroomId} />
      </div>
    </div>
  );
}
