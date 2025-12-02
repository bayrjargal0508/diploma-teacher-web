import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

interface ExamMetaDataType {
  questionCount: number;
}

interface TeacherCreateExamProps {
  examMetaData: ExamMetaDataType;
  onClose: () => void;
  onSuccess?: (chooseCount: number, fillCount: number) => void;
}

const QuestionCountModal: React.FC<TeacherCreateExamProps> = ({
  onClose,
  examMetaData,
  onSuccess,
}) => {
  const questionCount = examMetaData.questionCount;

  const [chooseCount, setChooseCount] = useState<number>(0);
  const [fillCount, setFillCount] = useState<number>(0);

  const total = chooseCount + fillCount;
  const isExceeded = total > questionCount;
  const isInvalid = chooseCount <= 0 || fillCount <= 0;

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] h-[370px] bg-background rounded-lg shadow-xl flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl">Тестийн тоо оруулна уу</p>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="bg-background-secondary text-start p-2 gap-1 rounded-lg">
          <p>
            Нийт тестийн тоо
            <span className="pl-2 font-semibold text-primary">
              {questionCount}
            </span>
          </p>
          {isExceeded && (
            <p className="text-xs text-negative mt-1">
              Та нийт боломжит асуултаас олон асуулт оруулсан байна.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="subTitle text-left">Сонгох тестийн тоо оруулна уу</p>

          <Input
            placeholder="Сонгох тестийн тоо"
            type="number"
            value={chooseCount}
            onChange={(e) => setChooseCount(Number(e.target.value))}
          />

          <p className="subTitle text-left">Нөхөх тестийн тоо оруулна уу</p>

          <Input
            placeholder="Нөхөх тестийн тоо"
            type="number"
            value={fillCount}
            onChange={(e) => setFillCount(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button className="w-[100px]" variant="secondary" onClick={onClose}>
            Буцах
          </Button>

          <Button
            className="w-[100px]"
            disabled={isExceeded || isInvalid}
            onClick={() => {
              if (!isExceeded && onSuccess) {
                onSuccess(chooseCount, fillCount);
              }
            }}
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </div>
  );
};
export default QuestionCountModal;
