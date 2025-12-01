"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setNewPassword, checkResetPassword, resetPassword } from "@/actions";
import { toast } from "react-toastify";
import { IoChevronBackOutline } from "react-icons/io5";
import { EMAIL_REG } from "@/utils/regex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordValidator from "@/components/auth/password-validator";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!username.trim()) {
      toast.error("Та цахим хаягаа оруулна уу!!!");
      return;
    }
    if (!EMAIL_REG.test(username)) {
      toast.error("Зөв цахим хаяг оруулна уу!!!");
      return;
    }

    try {
      const resPass = await resetPassword(username);

      if (resPass.result) {
        toast.success(
          resPass.data || resPass.message || "Баталгаажуулах код илгээгдлээ."
        );
        setStep(2);
      } else {
        toast.error(resPass.message || "Алдаа гарлаа");
      }
    } catch {
      toast.error("Алдаа гарлаа");
    }
  };

  const handleSubmitCode = async () => {
    if (!resetCode.trim()) {
      toast.error("Баталгаажуулах код шаардлагатай.");
      return;
    }

    try {
      const res = await checkResetPassword(username, resetCode);
      if (res?.result) {
        toast.success("Сэргээх код зөв байна.");
        setStep(3);
      } else {
        toast.error(res?.message || "Сэргээх код буруу байна.");
      }
    } catch {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleSetPassword = async () => {
    if (!password || !password2) {
      toast.error("Нууц үг шаардлагатай.");
      return;
    }

    if (password !== password2) {
      toast.error("Нууц үг тохирохгүй байна.");
      return;
    }

    if (password.length < 6) {
      toast.error("Нууц үг дор хаяж 6 тэмдэгт байх ёстой.");
      return;
    }

    try {
      const res = await setNewPassword(username, resetCode, password);

      if (res && res.result === true) {
        toast.success(res.message || "Нууц үг амжилттай солигдлоо.");
        router.push("/login");
      } else {
        const errorMessage = res?.message || "Нууц үг солих үед алдаа гарлаа.";
        toast.error(errorMessage);

        if (
          errorMessage.includes("Invalid") ||
          errorMessage.includes("expired")
        ) {
          setStep(1);
          setResetCode("");
        }
      }
    } catch {
      toast.error("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  return (
    <div className="bg-background flex h-full max-h-[513px] w-full max-w-[339px] flex-col rounded-2xl bg-header_background p-6 shadow-lg md:p-5">
      <div className="relative mb-[22px] flex items-center justify-center">
        <button
          title="step"
          type="button"
          onClick={() => {
            if (step > 1) setStep(step - 1);
          }}
          className="absolute left-0 flex items-center"
        >
          <IoChevronBackOutline
            className="h-6 w-6 cursor-pointer text-label_dark"
            onClick={() => router.push("/login")}
          />
        </button>

        <p className="right-0 ml-5 text-[18px] font-extrabold text-label_dark">
          <span className="text-primary">Yesh.mn</span>-д тавтай морил 🥰
        </p>
      </div>

      {step === 1 && (
        <div className="flex h-full w-full flex-col items-start">
          <div className="title2Text mb-[13px] text-label_color">
            Нууц үг сэргээх
          </div>
          <form className="flex h-full w-full grow flex-col gap-y-2">
            <div className="flex flex-col items-start gap-2">
              <p className="overlineText text-label_color">Цахим хаяг</p>
              <Input
                placeholder="Цахим хаягаа оруулна уу"
                type="text"
                id="username"
                height="40"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="flex h-full w-full flex-col items-start">
          <div className="title2Text mb-[13px] text-label_dark">
            Баталгаажуулах код оруулна уу
          </div>
          <p className="paragraphText mb-[22px] text-[#94A3B8]">
            Таны цахим хаяг руу явуулсан баталгаажуулах кодыг оруулна уу
          </p>
          <Input
            placeholder="Баталгаажуулах код"
            type="text"
            id="resetCode"
            height="40"
            defaultValue={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex h-full w-full flex-col items-start">
          <div className="title2Text mb-[13px] text-label_dark">
            Нууц үгээ зохионо уу
          </div>
          <div className="flex h-full w-full flex-col justify-between">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col items-start gap-y-2">
                <p className="overlineText text-label_color">Нууц үг</p>

                <div className="relative w-full">
                  <Input
                    placeholder="Нууц үг"
                    type={showPassword ? "text" : "password"}
                    id="pass"
                    height="40"
                    value={password}
                    onChange={(e) => setPassword1(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <div className="transition-all duration-300">
                  <PasswordValidator password={password} />
                </div>
              </div>

              <div className="flex flex-col items-start gap-y-2">
                <p className="overlineText text-label_color">Нууц үг давтах</p>
                <div className="relative w-full">
                  <Input
                    placeholder="Нууц үг давтах"
                    type={showPassword2 ? "text" : "password"}
                    id="pass1"
                    height="40"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword2 ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                {password2 && password2 !== password && (
                  <div className="pl-1 text-xs text-[#E65665]">
                    Нууц үг таарахгүй байна
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        {step === 1 && (
          <Button onClick={handleResetPassword} className="w-full">
            ҮРГЭЛЖЛҮҮЛЭХ
          </Button>
        )}
        {step === 2 && (
          <Button onClick={handleSubmitCode} className="w-full">
            ҮРГЭЛЖЛҮҮЛЭХ
          </Button>
        )}
        {step === 3 && (
          <Button onClick={handleSetPassword} className="w-full">
            ҮРГЭЛЖЛҮҮЛЭХ
          </Button>
        )}
        <div className="bottom-0 mt-4 flex w-full gap-[13px] md:mt-[23px]">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`h-1 w-full rounded-lg transition-all duration-300 ${
                step >= stepNumber ? "bg-primary" : "bg-[#94A3B8]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
