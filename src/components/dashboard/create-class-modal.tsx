"use client";

import { ChevronDown, X } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createClassroom } from "@/actions";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "../ui/input-group";
import { Separator } from "@radix-ui/react-separator";

interface Types {
  onClose: () => void;
  onSuccess?: () => void;
}
interface FormValues {
  alias: string;
  description: string;
  classNumber: string;
}
const CreateClass = ({ onClose, onSuccess }: Types) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const selectedClass = watch("classNumber");
  const [loading, setLoading] = useState(false);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);
      const classNumber = parseInt(data.classNumber);
      const response = await createClassroom(
        data.alias,
        data.description,
        classNumber
      );
      if (response?.result) {
        toast.success("Анги амжилттай үүсгэгдлээ!");
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 w-full"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl shadow-lg p-6 w-full max-w-4xl"
        onClick={handleContainerClick}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Анги үүсгэх</h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-black"
            onClick={onClose}
          />
        </div>

        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/assets/photos/create-classroom.png"
                  alt="create classroom"
                  width={280}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600">
                  Та өөрийн заах хичээлийн ангийг үүсгэн, үндсэн тохиргоог
                  хийнэ. Анги үүсгэснээр та сурагчдаа нэгтгэх, даалгавар,
                  шалгалт хуваарилах боломжтой болно.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="alias">Ангийн нэр</label>
                <Input
                  id="alias"
                  placeholder="Ангийн нэр"
                  className="hover:border-primary border"
                  {...register("alias", {
                    required: "Ангийн нэр оруулна уу",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Ангийн нэр хоосон байж болохгүй",
                    maxLength: {
                      value: 15,
                      message: "15 оронгийн урттай байх ёстой",
                    },
                  })}
                />

                {errors.alias && (
                  <span className="text-negative text-xs ml-2">
                    {errors.alias.message}
                  </span>
                )}

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Тайлбар
                  </label>

                  <InputGroup className="hover:border-primary border focus:border-primary h-12">
                    <InputGroupTextarea
                      {...register("description")}
                      placeholder="Тухайн ангийн талаар нэмэлт мэдээлэл, тайлбарыг оруулна."
                    />
                    <InputGroupAddon align="block-end">
                      <Separator orientation="vertical" className="h-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className="relative z-9999">
                  <label className="text-sm font-medium mb-1 block">
                    Анги сонгох
                  </label>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="hover:border-primary focus:border-primary flex items-center justify-between h-10 w-full text-base px-[15px] py-2 border border-stroke-line rounded-lg text-label-caption"
                      >
                        <span>
                          {selectedClass
                            ? `${selectedClass}-р анги`
                            : "Ангийн түвшин сонгох"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-(--radix-dropdown-menu-trigger-width) z-9999"
                      align="start"
                    >
                      {["12", "11", "10", "9", "8"].map((classNumber) => (
                        <DropdownMenuItem
                          key={classNumber}
                          onClick={() => setValue("classNumber", classNumber)}
                          className="text-black hover:bg-gray-100"
                        >
                          {classNumber}-р анги
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="px-6 py-2 rounded-xl shadow-sm"
              >
                Хаах
              </Button>
              <Button type="submit" disabled={loading} className="w-[100px]">
                {loading ? "Үүсгэж байна..." : "Анги үүсгэх"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;
