"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import Editicon from "../icons/info-icon";
import { Button } from "../ui/button";
import { editClassroom, generateInvitationCode } from "@/actions";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import { ChevronDown, LinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
interface SettingTabProps {
  id: string;
  invitationCode: string;
  alias: string;
  description: string;
  classnumber: number;
}

interface InvitationCodeResponse {
  data: {
    invitationCode: string;
  };
}

export const SettingTab = ({
  id,
  invitationCode,
  alias,
  description,
  classnumber,
}: SettingTabProps) => {
  const [currentalias, setCurrentAlias] = useState(alias);
  const [currentclassnumber, setCurrentClassnumber] = useState(classnumber | 12);
  const [currentdescription, setCurrentDescription] = useState(description);
  const [studentCount] = useState(0);
  const [src, setSrc] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState(invitationCode);

  const classes = [8, 9, 10, 11, 12];

  const link = `https://yesh.mn/classroom/${currentCode}`;

  useEffect(() => {
    const generate = async () => {
      const url = await QRCode.toDataURL(link);
      setSrc(url);
    };
    generate();
  }, [link]);

  const handleChanged = async () => {
    try {
      const response = (await generateInvitationCode(
        id
      )) as InvitationCodeResponse;

      const newCode = response.data.invitationCode;

      setCurrentCode(newCode);

      toast.success("Холбоос амжилттай шинэчлэгдлээ!");
    } catch (error) {
      console.error("Error calling generateInvitationCode:", error);
      toast.error("Холбоос шинэчлэхэд алдаа гарлаа!");
    }
  };

  // ---- FIX: BACKEND-д зөв payload format ---- //
  const handleEdit = async () => {
    try {
      const payload = {
        classroomId: id,
        alias: currentalias,
        description: currentdescription,
        classNumber: currentclassnumber,
        studentCount: studentCount,
      };

      const res = await editClassroom(payload);

      if (res.result) {
        toast.success("Амжилттай хадгалагдлаа!");
      } else {
        toast.error("Ангийн мэдээллээ бүрэн оруулна уу!");
      }
    } catch (err) {
      toast.error("Алдаа гарлаа!");
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-5 sm:gap-4 w-full pb-5">
      <div className="text-[16px] font-semibold w-full gap-5 flex flex-col rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5">
        <p className="font-semibold flex gap-2.5">
          <Editicon /> Ангийн мэдээлэл
        </p>

        <div>
          <label className="text-label-secondary">Ангийн нэр</label>
          <Input
            value={currentalias}
            placeholder={currentalias}
            onChange={(e) => setCurrentAlias(e.target.value)}
          />
        </div>

        <div className="relative">
          <label className="text-label-secondary">Анги сонгох</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`
                              flex items-center justify-between 
                              h-10 w-full text-base px-[15px] py-2 
                              border border-stroke-line rounded-lg
                              ${
                                currentclassnumber
                                  ? "text-black"
                                  : "text-label-caption"
                              }
                            `}
              >
                {currentclassnumber}-р анги
                <ChevronDown size={20} className="text-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-(--radix-dropdown-menu-trigger-width) bg-background-secondary"
            >
              {classes.map((num) => (
                <DropdownMenuItem
                  key={num}
                  onClick={() => setCurrentClassnumber(num)}
                >
                  {num}-р анги
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="text-label-secondary">Тайлбар</label>

          <Textarea
            value={currentdescription}
            placeholder={currentdescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            className="text-label-paragraph font-normal h-[70px] line-clamp-2"
          />
        </div>

        <Button variant="default" className="w-full" onClick={handleEdit}>
          Хадгалах
        </Button>
      </div>

      <div className="text-[16px] font-semibold w-full gap-5 flex flex-col rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5">
        <p className="font-semibold flex gap-2.5">
          <LinkIcon /> Ангийн холбоос
        </p>

        <div className="flex items-center justify-center">
          {src && <Image src={src} alt="QR Code" width={250} height={250} />}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-background rounded-[10px] p-5">
          <span className="text-[16px] text-label-caption font-semibold">
            {link}
          </span>
          <Button variant="secondary" size="inbutton" onClick={handleChanged}>
            <Editicon />
            Холбоос шинэчлэх
          </Button>
        </div>
      </div>
    </div>
  );
};
