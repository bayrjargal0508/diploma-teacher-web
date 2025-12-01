"use client";

import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
}

const LogoutConfirmModal: FC<LogoutConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60">
      <div className="bg-background  rounded-xl shadow-lg w-[400px] p-6 text-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <X size={20} onClick={onCancel} className="cursor-pointer" />
        </div>
        <div className="flex justify-center mb-5">
          <Image
            src="/assets/photos/log-out.png"
            alt="logout confirm"
            width={170}
            height={120}
          />
        </div>
        <div className="flex justify-center gap-3 mt-4 w-full">
          <Button variant="secondary" onClick={onCancel} className="w-40">
            Үгүй
          </Button>
          <Button onClick={onConfirm} className="w-40">
            Тийм
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
