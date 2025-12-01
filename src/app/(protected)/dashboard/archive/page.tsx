"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Users, FileText, Dot } from "lucide-react";

import { Classroom } from "@/lib/types";
import Image from "next/image";
import { toast } from "react-toastify";
import { archiveClassroom, classroom, editClassroom } from "@/actions";
import { Button } from "@/components/ui/button";
import ArchiveModal from "@/components/dashboard/archive-modal";
import EmptyPage from "@/components/dashboard/empty";

const ArchivePage = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [editType, setEditType] = useState<"name" | "description" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const reloadClassrooms = () => setRefresh((prev) => !prev);

  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );

  const fetchClassrooms = useCallback(async () => {
    try {
      const res = await classroom("INACTIVE");
      if (res.result && Array.isArray(res.data)) {
        return res.data;
      } else {
        toast.error(res.message || "Ангийн жагсаалт авахад алдаа гарлаа.");
        return [];
      }
    } catch (error) {
      toast.error(`Сүлжээний алдаа гарлаа.: ${error}`);
      return [];
    }
  }, []);
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const data = await fetchClassrooms();
      if (isMounted) {
        setClassrooms(data);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchClassrooms, refresh]);

  const handleSaveEdit = async () => {
    if (!selectedClassroom || !editType) return;

    const response = await editClassroom({
      classroomId: selectedClassroom.id,
      alias: editType === "name" ? editValue.trim() : selectedClassroom.alias,
      description:
        editType === "description"
          ? editValue.trim()
          : selectedClassroom.description,
      studentCount: selectedClassroom.studentCount,
    });

    if (response.result) {
      toast.success("Амжилттай засагдлаа!");
      reloadClassrooms();
      setEditType(null);
      setSelectedClassroom(null);
      setEditValue("");
    } else {
      toast.error(response.message || "Засахад алдаа гарлаа.");
    }
  };

  if (!classrooms || classrooms.length === 0) {
    return (
      <EmptyPage
        title="Архивлагдсан анги алга байна"
        describe="Танд архивлагдсан анги алга байна"
        src="/assets/photos/empty-monster.png"
        buttontag=""
      />
    );
  }

  return (
    <div className="min-h-screen bg-background rounded-[10px] p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {classrooms.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col rounded-2xl bg-background-secondary p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 space-y-2">
                <Image
                  src={cls.classroomIcon}
                  alt="Class"
                  className="size-[60px]"
                  width={60}
                  height={60}
                />
                <div>
                  <p className="font-extrabold text-lg">{cls.alias}</p>

                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md ">
                    {cls.status === "ACTIVE" ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md border-positive border">
                        Идэвхтэй
                      </span>
                    ) : cls.status === "INACTIVE" ? (
                      <span className="text-xs text-[#FF9900] bg-[#FEEBCE] px-2 py-1 rounded-md border border-[#FDD79D]">
                        Архивласан
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </div>

              {/* <div className="cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full hover:bg-background p-0.5">
                      <MoreHorizontal size={24} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="w-48 bg-background-secondary p-2 border border-stroke-line rounded-[10px]"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setEditType("name");
                        setEditValue(cls.alias);
                        setSelectedClassroom(cls);
                      }}
                    >
                      <p className="flex items-center justify-start gap-1.5 text-sm font-semibold">
                        <Edit2 size={16} /> Ангийн нэр засах
                      </p>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setEditType("description");
                        setEditValue(cls.description || "");
                        setSelectedClassroom(cls);
                      }}
                      className="mt-2.5"
                    >
                      <p className="flex items-center justify-start gap-1.5 text-sm font-semibold">
                        <Edit size={16} />
                        Ангийн тайлбар засах
                      </p>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="mt-2.5"
                      onClick={() => {
                        setSelectedClassroom(cls);
                        setIsOpen(true);
                      }}
                    >
                      <p className="flex items-center justify-start gap-1.5 text-primary text-sm font-semibold">
                        <Trash size={16} />
                        Архив
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}
            </div>

            <div className="flex items-center gap-4 text-sm mt-3 justify-start px-1">
              <Users size={16} /> {cls.studentCount} Сурагч
              <Dot />
              <FileText size={16} /> {cls.studentCount} Шалгалт
            </div>
            <p className="text-sm">{cls.description}</p>
          </div>
        ))}
        {isOpen && selectedClassroom && (
          <ArchiveModal
            onClose={() => setIsOpen(false)}
            onConfirm={async () => {
              const response = await archiveClassroom(selectedClassroom.id);
              if (response?.result) {
                toast.success("Амжилттай архивлагдлаа!");
                reloadClassrooms();
                setIsOpen(false);
              } else {
                toast.error(response?.message || "Архивлахад алдаа гарлаа.");
              }
            }}
          />
        )}

        {editType && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-background-secondary rounded-xl p-6 w-[400px] shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editType === "name" ? "Нэр засах" : "Тайлбар засах"}
              </h2>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="border rounded-lg w-full px-3 py-2 mb-4 focus:outline-none"
                placeholder={
                  editType === "name" ? "Шинэ нэр оруулна уу" : "Шинэ тайлбар"
                }
              />
              <div className="flex justify-between gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditType(null);
                    setEditValue("");
                    setSelectedClassroom(null);
                  }}
                >
                  Болих
                </Button>
                <Button onClick={handleSaveEdit} className="w-[100px]">
                  Хадгалах
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
