import PendingStudents from "./pending-students";
import TableStudents from "./table-students";
import { StudentsList } from "@/lib/types";

interface StudentTabProps {
  pendingstudentlist: StudentsList | null;
  studentlist: StudentsList | null;
  getStudentData: () => void;
}

export const StudentTab = ({
  pendingstudentlist,
  studentlist,
  getStudentData,
}: StudentTabProps) => {
  return (
    <div className="flex flex-col gap-6 min-h-screen">
      {pendingstudentlist?.list && pendingstudentlist.list.length > 0 && (
        <PendingStudents
          pendingstudentlist={pendingstudentlist}
          getStudentData={getStudentData}
        />
      )}

      {studentlist?.list && studentlist.list.length > 0 && (
        <TableStudents
          studentlist={studentlist}
          getStudentData={getStudentData}
        />
      )}
    </div>
  );
};
