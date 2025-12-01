import Image from "next/image";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface emptyPageProps {
  title: string;
  describe: string;
  src: string;
  buttontag: string;
  onButtonClick?: () => void;
}

const EmptyPage = ({
  title,
  describe,
  src,
  buttontag,
  onButtonClick,
}: emptyPageProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background rounded-[10px]">
      <div className="flex flex-col items-center text-center w-[300px] space-y-5">
        {src && (
          <Image
            src={src}
            alt="empty monster image"
            width={250}
            height={150}
            className="mb-4"
          />
        )}

        <p className="title">{title}</p>
        <p className="text-label-paragraph paragraphText max-w-md">
          {describe}
        </p>
        {onButtonClick && (
          <Button className="w-full" onClick={onButtonClick}>
            <Plus className="mr-2 h-4 w-4" /> {buttontag}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyPage;
