"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import Editicon from "../icons/info-icon";
import { Button } from "../ui/button";
import { editClassroom, generateInvitationCode } from "@/actions";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import { LinkIcon } from "lucide-react";

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
  const [currentclassnumber, setCurrentClassnumber] = useState(classnumber);
  const [currentdescription, setCurrentDescription] = useState(description);
  const [studentCount] = useState(0);
  const [src, setSrc] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState(invitationCode);

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
    <div className="flex items-start gap-5 w-full pb-5 h-screen">
      <div className="bg-background-secondary text-[16px] font-semibold border w-full gap-5 border-[#D9D9DF] rounded-[10px] p-5 flex flex-col">
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
          <select
            title="class"
            className="w-full h-10 border rounded-lg px-4 text-base text-label-caption hover:border-primary focus:border-primary"
            value={currentclassnumber}
            onChange={(e) => setCurrentClassnumber(Number(e.target.value))}
          >
            {[8, 9, 10, 11, 12].map((num) => (
              <option key={num} value={num}>
                {num}-р анги
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-label-secondary">Тайлбар</label>
          <Input
            value={currentdescription}
            placeholder={currentdescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
          />
        </div>

        <Button variant="default" className="w-full" onClick={handleEdit}>
          Хадгалах
        </Button>
      </div>

      <div className="bg-background-secondary border w-full gap-2.5 border-[#D9D9DF] rounded-[10px] p-5 flex flex-col">
        <p className="font-semibold flex gap-2.5">
          <LinkIcon /> Ангийн холбоос
        </p>

        <div className="flex items-center justify-center">
          {src && <Image src={src} alt="QR Code" width={228} height={228} />}
        </div>

        <div className="flex items-center justify-between w-full bg-background rounded-[10px] p-5">
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
