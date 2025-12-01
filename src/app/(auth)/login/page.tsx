"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { login as userLogin } from "@/actions";
import { LoginType } from "@/lib/types";
import { setRefreshToken, setToken, setUserData } from "@/actions/cookies";
import { User } from "@/lib/responses";
import { useRouter } from "next/navigation";

export default function Login() {
  const { register, handleSubmit } = useForm<LoginType>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    setLoading(true);
    try {
      const response = await userLogin(data);

      if (response?.result) {
        const user = response.data as User;

        await setToken(user.token);
        await setRefreshToken(user.refreshToken);

        await setUserData({
          fullName: user.fullName,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        });

        console.log("User data saved");

        router.push("/");
      } else {
        toast.error(response?.message || "Нэвтрэхэд алдаа гарлаа.");
      }
    } catch (error) {
      toast.error(`Сервертэй холбогдох үед алдаа гарлаа.${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-contain flex w-full max-w-[339px] bg-background flex-col rounded-2xl bg-header_background p-6 shadow-lg md:p-5">
      <div className="flex justify-center">
        <p className="text-[18px] font-extrabold text-center text-label_dark">
          <span className="text-primary">Yesh.mn</span>-д тавтай морил 🥰
        </p>
      </div>

      <div className=" mt-3 flex flex-col items-center">
        <p className="text-center text-label-caption paragraphText">
          Хараахан бүртгүүлж амжаагүй явна уу?
        </p>
        <Link href="/register" className="text-primary underline text-sm">
          Бүртгүүлэх
        </Link>
      </div>

      <div className="title2Text mt-4 text-label_color">Нэвтрэх</div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2 flex flex-col gap-2"
      >
        <Input
          placeholder="Цахим хаяг"
          {...register("username", { required: true })}
        />
        <InputGroup>
          <InputGroupInput
            placeholder="Нууц үг"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: true })}
          />
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </InputGroupAddon>
        </InputGroup>

        <div className="mt-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Нэвтэрч байна..." : "НЭВТРЭХ"}
          </Button>
        </div>
      </form>

      <div className="mt-4 mx-1 flex items-center justify-between">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            size={14}
            className="rounded-sm border-[#D9D9DF] bg-background text-label-caption focus:ring-0"
          />
          <span className="paragraphText text-label-caption">Сануулах</span>
        </label>
        <Link
          href="/forgot-password"
          className="smallButton text-primary underline"
        >
          Нууц үг сэргээх
        </Link>
      </div>

      <p className="paragraphText mt-4 text-center text-label-caption md:mt-6">
        Нэвтрэх товч дарснаар та манай <br />
        үйлчилгээний нөхцлийг зөвшөөрсөнд тооцно.
      </p>
    </div>
  );
}
