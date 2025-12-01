"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  register as userRegister,
  registerCheckCode,
  activateRegister,
} from "@/actions";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  RegisterType,
  RegisterActivateType,
  RegisterCheckCodeType,
} from "@/lib/types";
import { toast } from "react-toastify";
import VerificationInput from "@/components/auth/verification-input";
import RegisterDropdown from "@/components/auth/register-dropdown";
import PasswordValidator from "@/components/auth/password-validator";
import { useRouter } from "next/navigation";

type FormData = {
  code: string;
};

type PasswordFormType = {
  password: string;
  passwordConfirm: string;
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState<string>("");
  const [passwordData, setPasswordData] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();

  const { register: registerRegister, handleSubmit: handleSubmitRegister } =
    useForm<RegisterType>();

  const { setValue, handleSubmit, control } = useForm<FormData>({
    defaultValues: { code: "" },
  });
  const codeValue = useWatch({ control, name: "code" });

  const {
    register: registerActivate,
    handleSubmit: handleSubmitActivate,
    control: activateControl,
  } = useForm<PasswordFormType>();

  const watchedPassword = useWatch({
    control: activateControl,
    name: "password",
  });

  const filterEmptyFields = <T extends object>(data: T): Partial<T> => {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([value]) => value !== "" && value !== undefined
      )
    ) as Partial<T>;
  };

  const onRegister: SubmitHandler<RegisterType> = async (data) => {
    const filteredData = filterEmptyFields(data);
    try {
      const response = await userRegister(filteredData as RegisterType);

      if (response?.result) {
        setUsername(data.email || "");
        setStep(2);
        toast.success("Бүртгэл амжилттай!");
      } else {
        toast.error(response.message || "Хэрэглэгч бүртгэлтэй байна!");
      }
    } catch (error) {
      toast.error(`Алдаа гарлаа. Дахин оролдоно уу. ${error}`);
    }
  };

  const onVerifyCode: SubmitHandler<FormData> = async (data) => {
    try {
      const payload: RegisterCheckCodeType = {
        username: username,
        code: data.code,
      };

      const response = await registerCheckCode(payload);

      if (response?.result) {
        toast.success("Код амжилттай баталгаажлаа!");
        setStep(3);
      } else {
        toast.error(response?.message || "Баталгаажуулах код буруу байна!");
      }
    } catch (error) {
      toast.error(`Алдаа гарлаа. Дахин оролдоно уу.${error}`);
    }
  };

  const onSetPassword: SubmitHandler<PasswordFormType> = async (data) => {
    if (data.password !== data.passwordConfirm) {
      toast.error("Нууц үг таарахгүй байна!", {
        type: "error",
      });
      return;
    }
    setPasswordData(data.password);
    setStep(4);
  };

  const onFinishRegister = async () => {
    if (!selectedSubjectId) {
      toast.error("Хичээл сонгоно уу!");
      return;
    }

    if (!selectedSchoolId) {
      toast.error("Сургууль сонгоно уу!");
      return;
    }

    const activateData: RegisterActivateType = {
      code: codeValue,
      password: passwordData,
      subjectId: selectedSubjectId,
      schoolId: selectedSchoolId,
      gender: selectedGender,
    };

    const response = await activateRegister(activateData);

    if (response?.result) {
      toast.success("Бүртгэл амжилттай! Та нэвтэрнэ үү.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      toast.error(response?.message || "Бүртгэл амжилтгүй боллоо!");
    }
  };

  return (
    <div className="flex h-full max-h-[513px] w-full max-w-[339px] flex-col rounded-2xl bg-background p-6 shadow-lg md:p-5">
      <div className="relative mb-[22px] flex items-center justify-center">
        <button
          title="atep"
          type="button"
          onClick={() => {
            if (step > 1) setStep(step - 1);
          }}
          className="absolute left-0 flex items-center"
        >
          <ArrowLeft
            className="h-6 w-6 cursor-pointer text-label_dark"
            onClick={() => router.push("/login")}
          />
        </button>

        <p className="text-[18px] font-extrabold text-center ml-3 text-label_dark">
          {" "}
          <span className="text-primary">Yesh.mn</span>-д тавтай морил 🥰
        </p>
      </div>
      {step === 1 ? (
        <div className="flex h-full w-full flex-col items-start">
          <div className="title2Text mb-[13px] text-label_color">
            Бүртгүүлэх
          </div>
          <form className="flex h-full w-full grow flex-col gap-y-2">
            <div className="flex flex-col items-start gap-2">
              <p className="overlineText text-label_color">Овог</p>
              <Input
                placeholder="Овог"
                {...registerRegister("lastName", {
                  required: "Овог оруулна уу",
                })}
              />
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className="overlineText text-label_color">Нэр</p>
              <Input
                placeholder="Нэр"
                {...registerRegister("firstName", {
                  required: "Нэр оруулна уу",
                })}
              />
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className="overlineText text-label_color">Цахим хаяг</p>
              <Input
                placeholder="Цахим хаяг"
                type="email"
                {...registerRegister("email", {
                  required: "Цахим хаяг оруулна уу",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Зөв цахим хаяг оруулна уу",
                  },
                })}
              />
            </div>
          </form>
        </div>
      ) : step === 2 ? (
        <div className="flex h-full w-full flex-col items-start">
          <div className="subTitle mb-[13px] text-label_dark">
            Баталгаажуулах код оруулна уу
          </div>
          <p className="mediumButton mb-[22px] text-[#94A3B8]">
            Таны цахим хаяг руу явуулсан 4 оронтой баталгаажуулах кодыг оруулна
            уу
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onVerifyCode)}>
            <VerificationInput
              value={codeValue}
              onChange={(val) =>
                setValue("code", val, { shouldValidate: true })
              }
            />
          </form>
        </div>
      ) : step === 3 ? (
        <div className="flex h-full w-full flex-col items-start">
          <div className="subTitle mb-[13px] text-label_dark">
            Нууц үгээ зохионо уу
          </div>
          <form className="flex h-full w-full flex-col justify-between">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col items-start gap-y-2">
                <p className="subTitle text-label_color">Нууц үг</p>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Нууц үг"
                    {...registerActivate("password", {
                      required: "Нууц үг оруулна уу",
                      minLength: {
                        value: 6,
                        message: "Нууц үг 6-аас дээш тэмдэгт байх ёстой",
                      },
                    })}
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
                  <PasswordValidator password={watchedPassword || ""} />
                </div>
              </div>

              <div className="flex flex-col items-start gap-y-2">
                <p className="subTitle text-label_color">Нууц үг давтах</p>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Нууц үг давтах"
                    {...registerActivate("passwordConfirm", {
                      required: "Нууц үг давтан оруулна уу",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword2 ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : step === 4 ? (
        <div className="flex h-full w-full flex-col items-start">
          <div className="subTitle mb-[13px] text-label_dark">
            Заах хичээлээ сонгоно уу.
          </div>
          <RegisterDropdown
            onSelect={(subjectId) => setSelectedSubjectId(subjectId)}
            onLocationChange={({ schoolId, gender }) => {
              setSelectedSchoolId(schoolId);
              setSelectedGender(gender);
            }}
          />
        </div>
      ) : null}
      <div>
        {step === 1 ? (
          <div className="">
            <Button
              className="w-full"
              onClick={handleSubmitRegister(onRegister)}
            >
              ҮРГЭЛЖЛҮҮЛЭХ
            </Button>
          </div>
        ) : step === 2 ? (
          <div className="mt-auto">
            <Button
              className="w-full"
              disabled={codeValue.length < 4}
              onClick={handleSubmit(onVerifyCode)}
            >
              ҮРГЭЛЖЛҮҮЛЭХ
            </Button>
          </div>
        ) : step === 3 ? (
          <div>
            <Button
              className="w-full"
              onClick={handleSubmitActivate(onSetPassword)}
            >
              ҮРГЭЛЖЛҮҮЛЭХ
            </Button>
          </div>
        ) : step === 4 ? (
          <div>
            <Button
              className="w-full"
              onClick={onFinishRegister}
              disabled={!selectedSubjectId}
            >
              ДУУСГАХ
            </Button>
          </div>
        ) : null}
        <div className="bottom-0 mt-4 flex w-full gap-[13px] md:mt-[23px]">
          {[1, 2, 3, 4].map((stepNumber) => (
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
