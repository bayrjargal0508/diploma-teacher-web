"use client";

import { archiveClassroom, classroom, editClassroom } from "@/actions";
import { Classroom } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Users,
  FileText,
  Dot,
  Trash,
  Edit2,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArchiveModal from "@/components/dashboard/archive-modal";
import MenuSidebar from "@/components/icons/menu-icon";
import { Input } from "@/components/ui/input";
import EmptyPage from "@/components/dashboard/empty";
import { useClassroomRefresh } from "../providers/refresh-provider";
import CreateClass from "../dashboard/create-class-modal";
import { useTitleContext } from "../providers/title-provider";

const ClassroomList = () => {
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const reloadClassrooms = () => setRefresh((prev) => !prev);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const { setTitle } = useTitleContext();
  const { refreshTrigger } = useClassroomRefresh();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");

    if (!status) {
      router.replace("/dashboard/classroom?status=ACTIVE");
    }
  }, [searchParams, router]);

  const fetchClassrooms = useCallback(async () => {
    try {
      setLoading(true);

      const status = searchParams.get("status") || "ACTIVE";
      const res = await classroom(status);

      if (res.result && Array.isArray(res.data)) {
        return res.data;
      } else {
        toast.error(res.message);
        return [];
      }
    } catch (error) {
      toast.error(`Сүлжээний алдаа гарлаа.: ${error}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

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
  }, [refresh, refreshTrigger, searchParams, showPopup, fetchClassrooms]);

  const handleSaveEdit = async () => {
    if (!selectedClassroom) return;

    const response = await editClassroom({
      classroomId: selectedClassroom.id,
      alias: editName.trim() || selectedClassroom.alias,
      description: editDescription.trim() || selectedClassroom.description,
      studentCount: selectedClassroom.studentCount,
      classnumber: selectedClassroom.classnumber,
    });

    if (response.result) {
      toast.success("Амжилттай засагдлаа!");
      reloadClassrooms();
      setSelectedClassroom(null);
      setEditName("");
      setEditDescription("");
    } else {
      toast.error(response.message || "Засахад алдаа гарлаа.");
    }
  };

  const directClassroom = (id: string) => {
    router.push(`/dashboard/classroom/${id}`);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 min-h-screen bg-background rounded-[10px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }
  if (!classrooms || classrooms.length === 0) {
    return (
      <div>
        <EmptyPage
          title="Та өөрийн ангиа үүсгэнэ үү"
          describe=" Сурагчдаа урьж, хамтдаа амжилтад хүрэх аяллаа эхлүүлцгээе!"
          src="/assets/photos/empty-monster.png"
          buttontag="Анги үүсгэх"
          onButtonClick={() => setShowPopup(true)}
        />
        {showPopup && (
          <CreateClass
            onClose={() => setShowPopup(false)}
            onSuccess={() => fetchClassrooms()}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background rounded-[10px]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5 ">
        {classrooms.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col rounded-2xl bg-background-secondary p-4 space-y-2 justify-between"
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
                  <p
                    className="font-extrabold text-lg"
                    onClick={() => {
                      setTitle(cls.alias);
                    }}
                  >
                    {cls.alias}
                  </p>

                  <span className="text-xs rounded-md ">
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

              <div className="cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      title="more"
                      className="rounded-full hover:bg-background p-0.5"
                    >
                      <MenuSidebar />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="w-48 p-2 border border-stroke-line rounded-[10px] bg-background-secondary"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedClassroom(cls);
                        setEditName(cls.alias);
                        setEditDescription(cls.description || "");
                        setIsEditing(true);
                      }}
                    >
                      <p className="flex items-center justify-start gap-1.5 text-sm font-semibold">
                        <Edit2 size={16} /> Мэдээлэл засах
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
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 text-sm mt-3 justify-start px-1">
                <Users size={16} /> {cls.studentCount} Сурагч
                <Dot />
                <FileText size={16} /> {cls.studentCount} Шалгалт
              </div>
              <p className="text-sm truncate ">{cls.description}</p>
            </div>
            <Button
              onClick={() => {
                setTitle(cls.alias);
                directClassroom(cls.id);
              }}
              disabled={cls.status !== "ACTIVE"}
              variant="secondary"
              className="w-full"
            >
              <Plus /> Ангийн удирдлага
            </Button>
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

        {isEditing && selectedClassroom && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-background-secondary rounded-xl p-6 w-[400px] shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Нэр засах</h2>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border rounded-lg w-full px-3 py-2 mb-4 focus:outline-none"
                placeholder="Шинэ нэр оруулна уу"
              />

              <h2 className="text-lg font-semibold mb-4">Тайлбар засах</h2>
              <Input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border rounded-lg w-full px-3 py-2 mb-4 focus:outline-none"
                placeholder="Шинэ тайлбар оруулна уу"
              />

              <div className="flex justify-between gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedClassroom(null);
                    setEditName("");
                    setEditDescription("");
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

export default ClassroomList;
