export interface LoginType {
  username: string;
  password: string;
  deviceId?: string;
  appVersion?: string;
}

export interface RegisterType {
  lastName: string;
  firstName: string;
  email: string;
}
export type RegisterActivateType = {
  code: string;
  password: string;
  mobile?: string;
  gender?: string;
  schoolId?: string;
  subjectId: string;
};
export type RegisterCheckCodeType = {
  code: string;
  username?: string;
};
export interface Subject {
  id: string;
  name: string;
}
export interface ApiResponse<T> {
  result: boolean;
  data: T;
}

export interface Location {
  locationId: string;
  name: string;
}

export interface School {
  schoolId: string;
  name: string;
}

export type ResetPassword = {
  result: boolean;
  data?: boolean;
  message?: string;
};
export interface ResetPasswordResponse {
  result: boolean;
  data?: string;
  message?: string;
}
export interface CreateClassroom {
  alias: string;
  classroomId: string;
  description: string;
  studentCount: number;
  classnumber?: number;
}
export interface Classroom {
  id: string;
  createdDate: string | null;
  modifiedDate: string | null;
  alias: string;
  teacherId: string;
  status: "ACTIVE" | "INACTIVE" | string;
  invitationCode: string | null;
  invitationExpiresAt: string | null;
  key: string;
  createdDateText: string | null;
  description: string;
  classroomIcon: string;
  studentCount: number;
  classnumber: number;
  classroomSubjectName: string;
}

export interface StudentsList {
  pagination: Pagination;
  list: Students[];
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
  sortDirection?: "DESC";
  sortParams?: string[];
  current?: number;
}
export interface Students {
  id: string;
  classroomId: string;
  studentId: string;
  status: "PENDING" | "ACTIVE";
  respondedAt: string | null;
  createdDateText: string;
  student: Student;
}
export interface StudentExamResult {
  studentName: string;
  studentId: string;
  maxScore: number;
  grade: string;
  score: number;
  successRate: number;
}
export interface Student {
  studentId: string; 
  id: string;
  email: string;
  mobile: string;
  lastName: string;
  firstName: string;
  premium: boolean;
  gender: "MALE" | "FEMALE";
  createdDate: string;
  successRate: number;
  score: number;
  studentName: string;
  maxScore: number;
  grade: string;
}
export interface StudentResult {
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  grade: string;
  percent: number;
}

export interface ClassroomActivity {
  id: string;
  classroomId: string;
  studentUserId: string;
  teacherUserId: string;
  firstName: string;
  type: "JOIN" | "LEAVE" | string;
  content: string;
  student: Student;
  createdDate: string;
}
export interface ClassroomActivityResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    sortDirection: string;
    sortParams: string[];
    current: number;
  };
  list: ClassroomActivity[];
}
export type CreateExamPayload = {
  name: string;
  description: string;
  type: "SHUFFLE" | "YESH_LIBRARY" | "TEACHER_LIBRARY";
  classNumber: number;
  variantCount: number;
  questionCount: number;
  duration: number;
  status: "ACTIVE";
  visible: boolean;
  enabled: boolean;
  locked: boolean;
  draft: boolean;
};
export interface ClassroomActivity {
  id: string;
  classroomId: string;
  studentUserId: string;
  teacherUserId: string;
  firstName: string;
  type: "JOIN" | "LEAVE" | string;
  content: string;
  student: Student;
  createdDate: string;
}
export interface ExamListResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    sortDirection: "ASC" | "DESC";
    sortParams: string[];
    current: number;
  };
  list: ExamItem[];
}

export interface ExamItem {
  id: string;
  createdDate: string;
  modifiedDate: string | null;
  createdUser: string | null;
  modifiedUser: string | null;
  teacherId: string;
  classroomId: string | null;
  subjectId: string;
  categoryId: string;
  description: string;
  type: string;
  status: string;
  classNumber: number;
  variantCount: number;
  name: string;
  year: number;
  schoolClass: number;
  duration: number;
  premium: boolean;
  baseData: boolean;
  draft: boolean;
  visible: boolean;
  enabled: boolean;
  locked: boolean;
  startDate: string | null;
  finishDate: string | null;
  questionCount: number;
  verifiedCountByManage: number;
  verifiedCountByMobile: number;
  subjectName: string;
  categoryName: string;
  questions: unknown | null;
  tasks: unknown | null;
  latestExamResult: unknown | null;
  new: boolean;
  key: string;
  createdDateText: string;
  dataStatus: "PROCESSED" | "PROCESSING";
  taskCount: number;
}

export interface ExamKnowledge {
  id: string;
  typeCode: "KNOWLEDGE_LEVEL" | null;
  name: string;
  order: number;
}
export interface ExamContent {
  id: string;
  createdDate: Date;
  modifiedDate: Date;
  subjectId: string;
  schoolClass: number;
  name: string;
  prefix: string;
  questionCount: number;
  questionCountSubmittedTimeless: number;
  questionCountByKnowledgeLevel: Record<string, number>;
  subjectName: string;
  key: string;
  createdDateText: Date;
  examId: string;
}
export interface AllExamContent {
  id: string;
  createdDate: Date;
  modifiedDate: Date;
  subjectId: string;
  schoolClass: number;
  name: string;
  prefix: string;
  subjectName: string;
  key: string;
  createdDateText: Date;
}
export interface AllExamContentResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
  list: AllExamContent[];
}
export interface ShuffleExamPayload {
  questionContentCounts: {
    [contentId: string]: {
      contentId: string;
      countByKnowledgeLevel: { [knowledgeId: string]: number };
    };
  };
  taskCount: number;
}
export interface ExamListApiResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    sortDirection: string;
    sortParams: string[];
    current: number;
  };
  list: ExamDetailType[];
}

export interface ExamDetailType {
  id: string;
  teacherId: string;
  classroomId: string | null;
  name: string;
  description: string;
  type: string;
  status: string;
  classNumber: number;
  variantCount: number;
  duration: number;
  questionCount: number;
  taskCount: number;
  startDate: string | null;
  finishDate: string | null;
  variantQuestions: VariantQuestion[];
  questions: QuestionItem[];
}
export interface UpdateExamMetadataType {
  id: string;
  name: string;
  description: string;
  type: "SHUFFLE" | "YESH_LIBRARY" | "TEACHER_LIBRARY";
  duration: number;
  questionCount: number;
  variantCount: number;
}

export interface VariantQuestion {
  number: number;
  questions: QuestionItem[];
  tasks?: Task[];
}

export interface QuestionAnswer {
  id: string;
  createdDate: string;
  modifiedDate: string;
  createdUser: string | null;
  modifiedUser: string | null;
  examQuestionId: string;
  answerCode: string;
  correctValue: string | null;
  answerDataType: string;
  answerText: string | null;
  answerTextHtml: string | null;
  answerTextPng: string | null;
  answerPicUrl: string | null;
  correct: boolean;
  baseId: string | null;
  key: string;
  createdDateText: string;
}

export interface QuestionItem {
  id: string;
  createdDate: string;
  modifiedDate: string | null;
  createdUser: string | null;
  modifiedUser: string | null;
  subjectId: string;
  examId: string;
  examTaskId: string | null;
  contentId: string;
  subContentId: string | null;
  knowledgeLevelId: string;
  schoolClass: number;
  part: string | null;
  number: string;
  questionDataType: string;
  questionText: string | null;
  questionTextHtml: string | null;
  questionTextPng: string | null;
  questionPicUrl: string | null;
  answerType: "SELECT" | "FILL";

  solutionDataType: string;
  solutionText: string | null;
  solutionTextHtml: string | null;
  solutionTextPng: string | null;
  solutionPicUrl: string | null;

  score: number;
  answerCount: number;

  verifyLogManage: Record<string, string> | null;
  verifyLogManageCount: number;
  verifyLogMobile: string | null;
  verifyLogMobileCount: number;
  verifyComment: string | null;
  incorrect: boolean;

  baseExamId: string | null;
  baseId: string | null;
  prefix: string | null;
  orderField: number;
  premium: boolean;
  visible: boolean;

  questionAnswers: QuestionAnswer[];
  knowledgeLevelName: string;
  contentName: string;
}

export interface Task {
  id: string;
  title: string;
  instruction?: string;
  instructionHtml?: string;
  instructionPng?: string;
  visible: boolean;
  orderField: number;
  prefix: string;
  number: string;
  questions: QuestionItem[];
  taskAnswers: QuestionAnswer[];
  score: number;
  answerCount: number;
  knowledgeLevelName: string;
  contentName: string;
}
export interface TestBank {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  subject: string;
  classNumber: number;
}
export interface PredefinedExamCategory {
  id: string;
  name: string;
  createdDateText: string;
  createdDate: string;
}

export interface PredefinedExamProps {
  pagination: Pagination;
  list: PredefinedExamCategory[];
}
export interface PredefinedExamProps1 {
  pagination: Pagination;
  list: ExamItem[];
}
