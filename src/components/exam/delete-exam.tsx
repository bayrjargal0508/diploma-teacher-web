import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { ExamDelete } from "@/actions";
import Image from "next/image";

interface Types {
  onClose: () => void;
  onSuccess?: () => void;
  id: string;
}

const ExamDeleteModal = ({ onClose, onSuccess, id }: Types) => {
  const handleDelete = async () => {
    const res = await ExamDelete(id);

    if (res?.result !== false) {
      onSuccess?.();
      onClose();
    } else {
      toast.error("Алдаа гарлаа!");
    }
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 w-full"
      onClick={onClose}
    >
      <div
        className="bg-background-secondary p-6 rounded-lg shadow-xl flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-6 font-medium text-lg text-center">
          Та шалгалтаа устгахдаа итгэлтэй байна уу?
        </p>
        <Image
          src="/assets/photos/log-out.png"
          alt="log out"
          width={200}
          height={100}
          className="mx-auto"
        />
        <div className="flex gap-6 justify-between">
          <Button variant="secondary" onClick={onClose}>
            Буцах
          </Button>

          <Button onClick={handleDelete}>Устгах</Button>
        </div>
      </div>
    </div>
  );
};

export default ExamDeleteModal;
