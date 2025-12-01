import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Shuffle, Database } from "lucide-react";
import ExamShuffleModal from "../exam/exam-shuffle";
import { useParams, useSearchParams } from "next/navigation";
import { ExamItem } from "@/lib/types";
import { examMetadata } from "@/actions";
import ExamTestBankModal from "../exam/exam-bank-modal";
import TeacherCreateExam from "../exam/teacher-create-exam";

interface EmptyExamProps {
  onSuccess: () => void;
  examId: string;
  activeTab: string;
}

const EmptyExam: React.FC<EmptyExamProps> = ({
  onSuccess,
  examId,
  activeTab,
}) => {
  const [isShuffleOpen, setIsShuffleOpen] = useState(false);
  const [isTestBankOpen, setIsTestBankOpen] = useState(false);
  const [isTeacherLib, setIsTeacherLib] = useState(false);
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [examMetaData, setExamMetaData] = useState<ExamItem | null>(null);

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
    (async () => {
      await fetchExam();
    })();
  }, [id, searchParams, fetchExam]);

  const examType = examMetaData?.type;
  const variantNumber = activeTab.charCodeAt(0) - 65 + 1;

  const [selectedVariant, setSelectedVariant] = useState(variantNumber);

  return (
    <div className="flex flex-col items-center text-center p-5 w-[300px] space-y-2">
      <Image
        src="/assets/photos/empty-monster.png"
        alt="empty monster image"
        width={250}
        height={150}
        className="mb-4"
      />
      <p className="title">Одоогоор шалгалтын асуулт үүсгээгүй байна.</p>
      <p className="text-label-paragraph paragraphText max-w-md">
        Та Yesh.mn-ийн тестийн сангаас тухайн хичээлийн агуулгаар нь шалгалтын
        асуулт үүсгэх боломжтой.
      </p>

      {examType === "SHUFFLE" && (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setIsShuffleOpen(true)}
        >
          <Shuffle className="mr-2" />
          Shuffle асуулт үүсгэх
        </Button>
      )}

      {examType === "YESH_LIBRARY" && (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setSelectedVariant(variantNumber);
            setIsTestBankOpen(true);
          }}
        >
          <Database className="mr-2" />
          Тестийн сангаас сонгох
        </Button>
      )}
      {examType === "TEACHER_LIBRARY" && (
        <Button className="w-full" onClick={() => setIsTeacherLib(true)}>
          <Database className="mr-2" />
          Багш тест үүсгэх
        </Button>
      )}
      <ExamShuffleModal
        isOpen={isShuffleOpen}
        onClose={() => setIsShuffleOpen(false)}
        examId={String(id)}
        examMetaData={examMetaData}
        onSuccess={() => {
          onSuccess();
        }}
      />
      {examType === "YESH_LIBRARY" && (
        <ExamTestBankModal
          isOpen={isTestBankOpen}
          examId={examId}
          variant={String(selectedVariant)}
          onClose={() => setIsTestBankOpen(false)}
        />
      )}
      {/* ✅ examMetaData null биш эсэхийг шалгах */}
      {isTeacherLib && examMetaData && (
        <TeacherCreateExam
          key={examMetaData.questionCount}
          examId={examId}
          examMetaData={examMetaData}
          onClose={() => setIsTeacherLib(false)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};

export default EmptyExam;
