"use client";

import { useCallback, useEffect, useState } from "react";
import SmallNav from "@/components/classroom/small-nav";
import RightSidebar from "../dashboard/right-sidebar";
import {
  // classroomExamCount,
  getInvitationCode,
  getStudents,
  joinStudents,
} from "@/actions";
import { StudentsList } from "@/lib/types";
import { StudentTab } from "./students-tab";
import ExamTab from "./exam-tab";
import ReportTab from "./report-tab";
import EmptyPage from "../dashboard/empty";
import InvitationPopup from "../ui/invitation-popup";
import { SettingTab } from "./setting-tab";
import { useRouter, useSearchParams } from "next/navigation";

interface ClassroomDetailProps {
  classroomId: string;
}

interface CodeData {
  alias: string;
  classNumber: number;
  description: string;
  expiresAt: string;
  id: string;
  invitationCode: string;
}

export const ClassroomDetail = ({ classroomId }: ClassroomDetailProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [codeData, setCodeData] = useState<CodeData | null>(null);
  const [studentlist, setStudentlist] = useState<StudentsList | null>(null);
  const [pendingstudentlist, setPendingstudentlist] =
    useState<StudentsList | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const [itemSelected, setItemSelected] = useState(Number(tabParam) || 0);

  const CLASSROOM_TABS = ["Сурагчид", "Шалгалт", "Тайлан", "Тохиргоо"];

  useEffect(() => {
    const status = searchParams.get("tab");
    if (!status) {
      router.replace(`/dashboard/classroom/${classroomId}?tab=0`);
    }
  }, [searchParams, router, classroomId]);

  const fetchStudentData = useCallback(async () => {
    try {
      const [studentData, pendingStudentData] = await Promise.all([
        getStudents(classroomId),
        joinStudents(classroomId),
      ]);

      setStudentlist(studentData.data as StudentsList);
      setPendingstudentlist(pendingStudentData.data as StudentsList);
    } catch (err) {
      console.error("Error fetching student data:", err);
    }
  }, [classroomId]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getInvitationCode(classroomId);
        setCodeData(res.data as CodeData);

        await fetchStudentData();
      } catch (err) {
        console.error("Error loading classroom:", err);
      }
    };

    fetchAll();
  }, [classroomId, fetchStudentData]);

  const hasNoStudents =
    (studentlist?.list?.length ?? 0) === 0 &&
    (pendingstudentlist?.list?.length ?? 0) === 0;

  const handleSelect = (index: number) => {
    setItemSelected(index);
    router.replace(`?tab=${index}`);
  };

  if (!codeData) {
    return <div className="flex gap-2.5 h-screen"></div>;
  }

  return (
    <div className="flex gap-2.5 min:h-screen ">
      <div className="bg-background min:h-screen px-5 size-full rounded-[10px] flex flex-col">
        <SmallNav
          itemSelected={itemSelected}
          info={CLASSROOM_TABS}
          setItemSelected={handleSelect}
        />

        <div className="flex flex-col">
          {hasNoStudents && itemSelected !== 3 ? (
            <EmptyPage
              title={codeData.alias}
              describe="Сурагчдаа урьж, хамтдаа амжилтад хүрэх аяллаа эхлүүлцгээе!"
              src="/assets/mediumResult.svg"
              buttontag="Сурагч нэмэх"
              onButtonClick={() => setShowPopup(true)}
            />
          ) : (
            <>
              {itemSelected === 0 && (
                <StudentTab
                  pendingstudentlist={pendingstudentlist}
                  studentlist={studentlist}
                  getStudentData={fetchStudentData}
                />
              )}

              {itemSelected === 1 && <ExamTab classroomId={classroomId} />}

              {itemSelected === 2 && <ReportTab />}

              {itemSelected === 3 && (
                <SettingTab
                  id={classroomId}
                  invitationCode={codeData.invitationCode}
                  alias={codeData.alias}
                  description={codeData.description}
                  classnumber={codeData.classNumber}
                />
              )}
            </>
          )}
        </div>
      </div>

      <RightSidebar
        invitationCode={codeData.invitationCode}
        classroomId={classroomId}
        onStudentAdded={fetchStudentData}
      />

      {showPopup && (
        <InvitationPopup
          invitationCode={codeData.invitationCode}
          classroomId={classroomId}
          onClose={() => setShowPopup(false)}
          onStudentAdded={fetchStudentData}
        />
      )}
    </div>
  );
};
