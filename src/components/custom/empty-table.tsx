import Image from "next/image";

interface EmptyTableProps {
  src?: string;
  title?: string;
  description?: string;
}

export const EmptyTable = ({ title, description, src }: EmptyTableProps) => {
  return (
    <tr>
      <td colSpan={6} className="py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 flex items-center justify-center">
            {src && (
              <Image
                src={src}
                alt="empty"
                width={128}
                height={128}
                className="opacity-80"
              />
            )}
          </div>

          <h3 className="text-[16px] font-semibold text-primary-fifth mb-2">
            {title}
          </h3>

          <p className="text-[14px] text-label-caption max-w-sm">
            {description}
          </p>
        </div>
      </td>
    </tr>
  );
};
