import {
  AllExamContentResponse,
  Classroom,
  ClassroomActivityResponse,
  CreateClassroom,
  CreateExamPayload,
  ExamContent,
  ExamDetailType,
  ExamKnowledge,
  ExamListApiResponse,
  ExamListResponse,
  LoginType,
  PredefinedExamProps,
  PredefinedExamProps1,
  RegisterActivateType,
  RegisterCheckCodeType,
  RegisterType,
  ResetPassword,
  ResetPasswordResponse,
  ShuffleExamPayload,
  StudentExamResult,
  Subject,
  UpdateExamMetadataType,
} from "@/lib/types";
import { CustomResponse, fetchUtils } from "@/utils/fetcher";
import { BASE_URL, MANAGE_URL, TEACHER_API_URL } from "@/utils/urls";

//-------------------------------------
export type ShuffleExamResponse = void;

//Login
const login = (data: LoginType) => {
  return fetchUtils.post(TEACHER_API_URL + "/api/auth/login", {
    ...data,
    deviceId: data.deviceId || "web_client_01",
    appVersion: data.appVersion || "2.0",
  });
};

//Register
const register = (data: RegisterType) => {
  return fetchUtils.post(TEACHER_API_URL + "/api/auth/register-by-email", data);
};
const registerCheckCode = (data: RegisterCheckCodeType) => {
  return fetchUtils.post(
    TEACHER_API_URL + "/api/auth/check-activate-code",
    data
  );
};
const activateRegister = (data: RegisterActivateType) => {
  return fetchUtils.post(
    TEACHER_API_URL + "/api/auth/activate-registration",
    data
  );
};
const subjectRegister = async (): Promise<Subject[]> => {
  const res = (await fetchUtils.get(
    TEACHER_API_URL + "/api/reference/subjects"
  )) as unknown as CustomResponse<Subject[]>;
  return res.data ?? [];
};

//Reset password
const resetPassword = async (
  username: string
): Promise<ResetPasswordResponse> =>
  fetchUtils.post(TEACHER_API_URL + "/api/auth/reset-password", { username });

const checkResetPassword = async (
  username: string,
  resetCode: string
): Promise<ResetPassword> =>
  fetchUtils.post(TEACHER_API_URL + "/api/auth/check-reset-password", {
    username,
    resetCode,
  });

const setNewPassword = async (
  username: string,
  resetCode: string,
  password: string
): Promise<ResetPassword> =>
  fetchUtils.post(TEACHER_API_URL + "/api/auth/set-password", {
    username,
    resetCode,
    password,
  });

//Create classroom

const createClassroom = async (
  alias: string,
  description: string | undefined,
  classNumber: number
) => {
  try {
    const response = await fetchUtils.post(
      `${TEACHER_API_URL}/api/classroom/create`,
      { alias, description, classNumber },
      true
    );

    return response;
  } catch (error) {
    console.error("Failed to create classroom:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

//edit classroom

const editClassroom = async (data: CreateClassroom) => {
  try {
    const response = await fetchUtils.post(
      `${TEACHER_API_URL}/api/classroom/edit`,
      data,
      true
    );

    return response;
  } catch (error) {
    console.error("Failed to create classroom:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};
// get classroom
const classroom = async (status: string = "ACTIVE") => {
  try {
    const response = await fetchUtils.get<Classroom[]>(
      `${TEACHER_API_URL}/api/classroom?status=${status}`,
      true
    );

    return response;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

//accept student
const acceptStudent = async (id: string) => {
  try {
    const acceptstudent = await fetchUtils.post(
      `${TEACHER_API_URL}/api/classroom/join-request/${id}/approve`,
      {},
      true
    );
    return acceptstudent;
  } catch (error) {
    console.error("Error accepting student", error);
    return { result: false, message: "aaaaaaaaaaaa" };
  }
};

//multi accept students
const acceptAllStudents = async (classroomJoinRequestIds: string[]) => {
  try {
    const acceptallstudent = await fetchUtils.post(
      `${TEACHER_API_URL}/api/classroom/join-request/approve-multiple`,
      { classroomJoinRequestIds },
      true
    );
    return acceptallstudent;
  } catch (error) {
    console.error("Error  accepting all students", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

//decline student
const declineStudent = async (id: string) => {
  try {
    const declinestudent = await fetchUtils.delete(
      `${TEACHER_API_URL}/api/classroom/join-request/${id}/decline`,
      {},
      true
    );
    return declinestudent;
  } catch (error) {
    console.error("Error declining student", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

//decline all student
const declineAllStudent = async (classroomJoinRequestIds: string[]) => {
  try {
    const declinestudents = await fetchUtils.delete(
      `${TEACHER_API_URL}/api/classroom/join-request/decline-multiple`,
      { classroomJoinRequestIds },
      true
    );
    return declinestudents;
  } catch (error) {
    console.error("Error declining all students", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

//get students
const getStudents = async (classroomId: string) => {
  try {
    const student = await fetchUtils.get(
      `${TEACHER_API_URL}/api/classroom-student/${classroomId}?page=1&pageSize=1000`,
      true
    );
    return student;
  } catch (error) {
    console.error("Error fetching students:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

//remove student

const removeStudent = async (
  classroomId: string,
  classroomStudentId: string
) => {
  try {
    const student = await fetchUtils.delete(
      `${TEACHER_API_URL}/api/classroom/remove-student`,
      { classroomId, classroomStudentId },
      true
    );
    return student;
  } catch (error) {
    console.error("Error removing student", error);
    return { result: false, message: "Алдаа гарлаа" };
  }
};

//register
const getAimag = () => {
  return fetchUtils.get(BASE_URL + "/api/location?parentId=1");
};

const getDuureg = (aimagId: string) => {
  return fetchUtils.get(BASE_URL + `/api/location?parentId=${aimagId}`);
};

const getSchool = (duuregId: string) => {
  return fetchUtils.get(
    BASE_URL + `/api/school/select-by-location?location=${duuregId}`
  );
};
//archive classroom
const archiveClassroom = async (id: string) => {
  try {
    const response = await fetchUtils.patch<Classroom[]>(
      `${TEACHER_API_URL}/api/classroom/archive/${id}`,
      {},
      true
    );

    return response;
  } catch (error) {
    console.error("Error archiving classroom:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};
//
const classroomActivity = async (id: string) => {
  const response = await fetchUtils.get<ClassroomActivityResponse>(
    `${TEACHER_API_URL}/api/classroom/activity/${id}`,
    true
  );
  return response;
};
// exam create Exam
const createExam = async (data: CreateExamPayload) => {
  try {
    const response = await fetchUtils.post(
      `${TEACHER_API_URL}/api/exam/create-metadata`,
      data,
      true
    );

    return response;
  } catch (error) {
    console.error("Failed to create classroom:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};
const getInvitationCode = async (classroomId: string) => {
  try {
    const code = await fetchUtils.get(
      `${TEACHER_API_URL}/api/classroom/get-invitation?classroomId=${classroomId}`,
      true
    );
    return code;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

const InvitationCodeDirectly = async (
  classroomId: string,
  studentUsername: string
) => {
  try {
    const response = await fetchUtils.post(
      `${TEACHER_API_URL}/api/classroom/add-student-directly`,
      { classroomId, studentUsername },
      true
    );
    return response;
  } catch (error) {
    console.error("Error adding student directly:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

const generateInvitationCode = async (classRoomId: string) => {
  try {
    const response = await fetchUtils.post(
      `${TEACHER_API_URL}/api/classroom/generate-invitation`,
      { classRoomId },
      true
    );
    return response;
  } catch (error) {
    console.error("Error generating code", error);
    return { result: false, message: "Алдаа гарлаа" };
  }
};

const joinStudents = async (classroomId: string) => {
  try {
    const joinstudents = await fetchUtils.get(
      `${TEACHER_API_URL}/api/classroom/join-request/${classroomId}`,
      true
    );
    return joinstudents;
  } catch (error) {
    console.log("Error getting students", error);
    return { result: false, message: "Алдаа гарлаа" };
  }
};

//exam metadatas
const examMetadata = async (currentPage = 1, pageSize = 20) => {
  const response = await fetchUtils.get<ExamListResponse>(
    `${TEACHER_API_URL}/api/exam/metadata?currentPage=${currentPage}&pageSize=${pageSize}`,
    true
  );
  return response;
};

//exam shuffle
const examShuffle = async (id: string) => {
  const response = await fetchUtils.get<ExamListResponse>(
    `${TEACHER_API_URL}/api/classroom/activity/${id}`,
    true
  );
  return response;
};

// shuffle exam content
const examShuffleContent = async (id: string) => {
  const response = await fetchUtils.get<ExamContent>(
    `${TEACHER_API_URL}/api/exam/question/shuffle-content?examMetadataId=${id}`,
    true
  );
  return response;
};
// shuffle exam content
const examShuffleKnowledge = async () => {
  const response = await fetchUtils.get<ExamKnowledge>(
    `${TEACHER_API_URL}/api/exam/question/shuffle-content-knowledge-info`,
    true
  );
  return response;
};
//shuffle test post
const ShuffleExam = (
  data: ShuffleExamPayload,
  id: string
): Promise<CustomResponse<void>> => {
  return fetchUtils.post<undefined>(
    `${TEACHER_API_URL}/api/exam/question/${id}/shuffle`,
    data
  );
};

//
const examVariantQuestions = async (id: string) => {
  const response = await fetchUtils.get<ExamDetailType>(
    `${TEACHER_API_URL}/api/exam/${id}/questions`,
    true
  );
  return response;
};
//delete exam
const ExamDelete = async (examId: string) => {
  try {
    const examDelete = await fetchUtils.delete(
      `${TEACHER_API_URL}/api/exam/${examId}/delete`,
      {},
      true
    );
    return examDelete;
  } catch (error) {
    console.error("Error declining student", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};
//send exam
const sendExamToClassroom = async (
  classroomId: string,
  examMetadataId: string,
  startDate: string,
  finishDate: string
) => {
  try {
    const response = await fetchUtils.post(
      `${TEACHER_API_URL}/api/exam/assign`,
      { classroomId, examMetadataId, startDate, finishDate },
      true
    );

    return response;
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};
//edit metadata
const editExamMetadata = async (data: UpdateExamMetadataType) => {
  try {
    const response = await fetchUtils.put(
      `${TEACHER_API_URL}/api/exam/update-metadata`,
      data,
      true
    );
    return response;
  } catch (error) {
    console.error(error);
    return { result: false, message: "Алдаа гарлаа." };
  }
};

// classroom exam list
const examClassroomList = async (id: string, currentPage: number = 1, pageSize: number = 10) => {
  try {
    const response = await fetchUtils.get<ExamListApiResponse>(
      `${TEACHER_API_URL}/api/classroom/${id}/exams?currentPage=${currentPage}&pageSize=${pageSize}`,
      true
    );
    if (response.data) {
      return response.data;
    }
        return {
      pagination: {
        currentPage: currentPage,
        pageSize: pageSize,
        total: 0,
        sortDirection: "ASC",
        sortParams: [],
        current: currentPage,
      },
      list: [],
    };
  } catch {
    return {
      pagination: {
        currentPage: currentPage,
        pageSize: pageSize,
        total: 0,
        sortDirection: "ASC",
        sortParams: [],
        current: currentPage,
      },
      list: [],
    };
  }
};
// predefined Categories
const predefinedCategories = async () => {
  try {
    const response = await fetchUtils.get<PredefinedExamProps>(
      `${TEACHER_API_URL}/api/exam/predefined/categories`,
      true
    );

    return response.data?.list;
  } catch {
    return [];
  }
};
// predefined Year
export async function getPredefinedExams(params: {
  metadataId: string;
  categoryId: string;
  year: string;
  name: string;
}): Promise<PredefinedExamProps1> {
  const res = await fetchUtils.get<PredefinedExamProps1>(
    `${TEACHER_API_URL}/api/exam/predefined/${params.metadataId}/exam?categoryId=${params.categoryId}&year=${params.year}&name=${params.name}`,
    true
  );
  return (
    res.data ?? {
      pagination: {
        currentPage: 1,
        pageSize: 0,
        total: 0,
      },
      list: [],
    }
  );
}
// assign exam variant
const examVarient = async (
  examId: string | undefined,
  examMetadataId: string,

  variant: number
) => {
  try {
    const response = await fetchUtils.post(
      `${TEACHER_API_URL}/api/exam/predefined/assign-variant`,
      { examMetadataId, examId, variant },
      true
    );

    return response;
  } catch (error) {
    return { result: false, message: error };
  }
};

const classroomExamCount = async (classroomId: string, examMetadataId: string) => {
  try {
    const response = await fetchUtils.get<StudentExamResult>(
      `${TEACHER_API_URL}/api/report/classroom/${classroomId}/exam-count?metadataId=${examMetadataId}`,
      true
    );

    return response;
  } catch {
    return null;
  }
};
// 
const totalScore = async (classroomId: string) => {
  try {
    const response = await fetchUtils.get<StudentExamResult>(
      `${TEACHER_API_URL}/api/report/classroom/${classroomId}/total-scores`,
      true
    );

    return response;
  } catch {
    return null;
  }
};
// shuffle exam content
const examShuffleContentNoId = async () => {
  const response = await fetchUtils.get<ExamContent>(
    `${TEACHER_API_URL}/api/exam/question/shuffle-content?examMetadataId=6937ae31e6987b6e98033455`,
    true
  );
  return response;
};
//question content name
const manageAllSubjectContentName = async () => {
  const response = await fetchUtils.get<AllExamContentResponse>(
    `${MANAGE_URL}/api/exam-question-content?pageSize=100`,
    true
  );

  return response.data; 
};

export const sendAssign = async (
  assignId: string,
  classroomId: string,
  studentIds: string[]
) => {
  const res = await fetch("http://localhost:4000/api/assignments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}` // байвал
    },
    body: JSON.stringify({
      assignId,
      classroomId,
      studentIds,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Assign send failed");
  }

  return data;
};

export {
  login,
  register,
  registerCheckCode,
  activateRegister,
  subjectRegister,
  resetPassword,
  checkResetPassword,
  setNewPassword,
  createClassroom,
  classroom,
  joinStudents,
  getStudents,
  removeStudent,
  acceptStudent,
  acceptAllStudents,
  declineStudent,
  declineAllStudent,
  getInvitationCode,
  InvitationCodeDirectly,
  generateInvitationCode,
  getAimag,
  getDuureg,
  getSchool,
  editClassroom,
  archiveClassroom,
  classroomActivity,
  createExam,
  examMetadata,
  examShuffle,
  examShuffleContent,
  examShuffleKnowledge,
  ShuffleExam,
  examVariantQuestions,
  ExamDelete,
  sendExamToClassroom,
  editExamMetadata,
  examClassroomList,
  predefinedCategories,
  examVarient,
  classroomExamCount,
  totalScore,
  examShuffleContentNoId,
  manageAllSubjectContentName,
};
