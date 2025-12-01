"use client";

import { AlertCircle, CopyIcon, X } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import { InvitationCodeDirectly } from "@/actions";

interface InvitationPopupProps {
  invitationCode: string;
  classroomId: string;
  onClose: () => void;
  onStudentAdded?: () => void;
}

const InvitationPopup = ({
  invitationCode,
  classroomId,
  onClose,
  onStudentAdded,
}: InvitationPopupProps) => {
  const [activeTab, setActiveTab] = useState<"link" | "direct">("link");
  const [src, setSrc] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  const link = `https://yesh.mn/classroom/${invitationCode}`;

  useEffect(() => {
    const generate = async () => {
      const url = await QRCode.toDataURL(link);
      setSrc(url);
    };
    generate();
  }, [link]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Холбоос хууллаа!");
  };

  const handledirectlyAdd = async () => {
    if (!username) {
      toast.error("Сурагчийн нэвтрэх нэрийг оруулна уу!");
      return;
    }

    const res = await InvitationCodeDirectly(classroomId, username);

    if (res.result === true) {
      toast.success("Сурагч амжилттай нэмлээ!");
      setSuccess(true);
      setEmailError(false);
      onStudentAdded?.();
    } else {
      toast.error("Алдаа гарлаа!");
      setEmailError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-background rounded-[10px] p-5 w-[560px] shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-[16px]">Сурагч нэмэх</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="flex flex-col items-center text-[14px]">
          {/* Tabs */}
          <div className="flex w-full bg-background-secondary rounded-lg gap-2.5 p-2.5">
            <button
              onClick={() => setActiveTab("link")}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                activeTab === "link" ? "bg-[#D8EEFB]" : ""
              }`}
            >
              Холбоос
            </button>

            <button
              onClick={() => setActiveTab("direct")}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                activeTab === "direct" ? "bg-[#D8EEFB]" : ""
              }`}
            >
              Шууд нэмэх
            </button>
          </div>

          {/* ========================= LINK TAB ========================= */}
          {activeTab === "link" && (
            <div className="my-5 flex flex-col items-center gap-4 w-full">
              <p className="font-semibold text-[16px]">
                Урилгын холбоосоор нэмэх
              </p>

              <p className="font-normal text-[14px] text-center leading-5 px-2.5">
                Энэхүү холбоосыг хуулж, сурагчиддаа илгээнэ үү.
              </p>

              <div className="flex items-center justify-between w-full bg-background-secondary rounded-[10px] p-5">
                <span className="text-[14px] text-label-caption">{link}</span>

                <Button
                  variant="secondary"
                  size="inbutton"
                  onClick={handleCopy}
                >
                  <CopyIcon />
                  Холбоос хуулах
                </Button>
              </div>

              <div className="flex items-center w-full">
                <div className="grow border-t border-gray-300"></div>
                <span className="px-3 text-muted-foreground text-sm">
                  Эсвэл
                </span>
                <div className="grow border-t border-gray-300"></div>
              </div>

              {src && (
                <Image src={src} alt="QR Code" width={200} height={200} />
              )}

              <p>QR кодыг уншуулж ангид нэгдэнэ.</p>
            </div>
          )}

          {/* ========================= DIRECT TAB ========================= */}
          {activeTab === "direct" && (
            <div className="my-5 flex flex-col items-center gap-4 w-full">
              <Image
                src={
                  emailError
                    ? "/assets/lowResult.svg"
                    : "/assets/mediumResult.svg"
                }
                width={300}
                height={200}
                alt="statusImage"
              />

              {success ? (
                <div className="text-center">
                  <p className="font-semibold text-[16px]">
                    Урилга амжилттай илгээгдлээ.
                  </p>
                  <p className="text-[14px]">
                    <span className="text-[#FE9A05]">{username}</span> хаягтай
                    хэрэглэгчид урилга хүргэгдлээ.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-[16px]">
                      Ангийн код ашиглалгүйгээр бүртгэх
                    </p>
                    <p className="text-[14px]">
                      <span className="text-[#FE9A05]">yesh.mn</span> бүртгэлтэй
                      имэйл оруулна.
                    </p>
                  </div>

                  <div className="bg-background-secondary rounded-[10px] p-5 w-full flex gap-5 items-start">
                    <div className="flex flex-col w-full">
                      <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Бүртгэлтэй имэйл"
                        className="rounded-lg border border-gray-300 text-[16px] w-full py-2 px-[15px] focus:outline-none"
                      />

                      {emailError && (
                        <p className="bg-[#FEEBCE] flex items-center gap-1 text-[12px] rounded-md py-1 px-2 mt-3">
                          <AlertCircle size={14} color="#FF9900" />
                          Таны оруулсан имэйл бүртгэлгүй байна.
                        </p>
                      )}
                    </div>

                    <Button
                      variant="default"
                      size="inbutton"
                      className="flex items-center"
                      onClick={handledirectlyAdd}
                    >
                      Сурагч нэмэх
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          <Button
            onClick={onClose}
            variant="default"
            size="sm"
            className="w-full font-bold text-[12px]"
          >
            Хаах
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitationPopup;
