"use client";

import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface ArchiveModalProps {
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
}

const ArchiveModal = ({ onClose, onConfirm }: ArchiveModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl shadow-lg p-6 w-full max-w-md relative"
        onClick={handleInnerClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Ангийг архивлах уу?</h2>
          <button title="close" onClick={onClose}>
            <X className="size-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Image */}
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/photos/create-classroom.png"
            alt="Archive classroom"
            width={160}
            height={160}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">
            Болих
          </Button>
          <Button className="w-28" onClick={handleConfirm} disabled={loading}>
            {loading ? "Архивлаж байна..." : "Архивлах"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
