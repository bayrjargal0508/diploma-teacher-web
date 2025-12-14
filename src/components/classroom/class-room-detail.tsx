"use client";

import { useCallback, useEffect, useState } from "react";
import SmallNav from "@/components/classroom/small-nav";
import RightSidebar from "../dashboard/right-sidebar";
import { getInvitationCode, getStudents, joinStudents } from "@/actions";
import { StudentsList } from "@/lib/types";
import { StudentTab } from "./students-tab";

import ReportTab from "./report-tab";
import EmptyPage from "../dashboard/empty";
import InvitationPopup from "../ui/invitation-popup";
import { SettingTab } from "./setting-tab";
import { useRouter, useSearchParams } from "next/navigation";
import ExamTab from "./exam-tab";

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

  const router = useRouter();
  const searchParams = useSearchParams();

  // tab state synchronized with URL
  const tabParam = Number(searchParams.get("tab")) || 0;
  const [itemSelected, setItemSelected] = useState(tabParam);

  const CLASSROOM_TABS = ["Сурагчид", "Шалгалт", "Тайлан", "Тохиргоо"];

  // Ensure tab param exists
  useEffect(() => {
    if (!searchParams.get("tab")) {
      router.replace(`?tab=0`);
    }
  }, [searchParams, router]);

  // When tab changes in URL -> update state
  useEffect(() => {
    setItemSelected(tabParam);
  }, [tabParam]);

  // Smooth scroll for tab=2#scoreBoard
  useEffect(() => {
    const hash = window.location.hash;

    if (hash === "#scoreBoard") {
      setTimeout(() => {
        const el = document.getElementById("scoreBoard");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 150); // wait for tab render
    }
  }, [itemSelected]); // Trigger when tab UI changes

  // Fetch student data
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

  // Load all classroom data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getInvitationCode(classroomId);
        setCodeData(res.data as CodeData);

        await fetchStudentData();
      } catch (err) {
        console.error("Error loading classroom:", err);
      }
    };

    load();
  }, [classroomId, fetchStudentData]);

  const hasNoStudents =
    (studentlist?.list?.length ?? 0) === 0 &&
    (pendingstudentlist?.list?.length ?? 0) === 0;

  const handleSelect = (index: number) => {
    router.replace(`?tab=${index}`);
  };

  if (!codeData) return <div className="flex gap-2.5 h-screen"></div>;

  return (
    <div className="flex gap-2.5 min-h-screen">
      <div className="bg-background min-h-screen px-5 size-full rounded-[10px] flex flex-col">
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

              {itemSelected === 2 && <ReportTab/>}

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
        hideInviteButton={itemSelected === 1 || itemSelected === 3}
        hideInviteScoreBoard={itemSelected === 2}
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