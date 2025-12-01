"use client";

import { ChevronDown, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createExam } from "@/actions";
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
  id: string;
  name: string;
  description: string;
  type: "SHUFFLE" | "YESH_LIBRARY" | "TEACHER_LIBRARY";
  classNumber: string;
  variantCount: string;
  questionCount: string;
  duration: string;
}

type CreateExamPayload = {
  id: string;
  name: string;
  description: string;
  type: "SHUFFLE" | "YESH_LIBRARY" | "TEACHER_LIBRARY";
  classNumber: number;
  variantCount: number;
  questionCount: number;
  duration: number;
  status: "ACTIVE";
  visible: boolean;
  enabled: boolean;
  locked: boolean;
  draft: boolean;
};

const CreateExam = ({ onClose, onSuccess }: Types) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      type: undefined,
      classNumber: "12",
      variantCount: "2",
    },
  });

  const selectedType = watch("type");
  const selectedClass = watch("classNumber");
  const selectedVariant = watch("variantCount");
  const selectedDuration = watch("duration");
  const [loading, setLoading] = useState(false);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);

      const examData: CreateExamPayload = {
        id: data.id,
        name: data.name,
        description: data.description || "",
        type: data.type,
        classNumber: parseInt(data.classNumber),
        variantCount: parseInt(data.variantCount),
        questionCount: parseInt(data.questionCount),
        duration: parseInt(data.duration),
        status: "ACTIVE",
        visible: true,
        enabled: true,
        locked: false,
        draft: false,
      };

      const response = await createExam(examData);

      if (response?.result) {
        toast.success("Шалгалт амжилттай үүсгэгдлээ!");
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response?.message || "Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedType === "YESH_LIBRARY") {
      setValue("questionCount", "40");
      setValue("duration", "90");
    }
  }, [selectedType, setValue]);

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
          <h2 className="text-xl font-semibold">Шалгалт нээх</h2>
          <X className="cursor-pointer hover:text-black" onClick={onClose} />
        </div>

        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <Image
                  src="/assets/photos/create-classroom.png"
                  alt="create classroom"
                  width={280}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600">
                  Та энэ хэсэгт шалгалтын үндсэн мэдээллийг тохируулна. Үүнд:
                  шалгалтын нэр, вариантын тоо, зориулалт, анги, асуултын тоо,
                  нийт хугацаа багтана.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-start">Шалгалтын нэр</label>
                <Input
                  id="name"
                  placeholder="Шалгалтын нэр"
                  className="hover:border-primary border"
                  {...register("name", {
                    required: "Шалгалтын нэр оруулна уу",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Шалгалтын нэр хоосон байж болохгүй",
                  })}
                />
                {errors.name && (
                  <span className="text-negative text-xs ml-2">
                    {errors.name.message}
                  </span>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-start">Тайлбар</label>

                  <InputGroup className="hover:border-primary border focus:border-primary h-12">
                    <InputGroupTextarea
                      {...register("description")}
                      className="h-10"
                      placeholder="Тухайн ангийн талаар нэмэлт мэдээлэл, тайлбарыг оруулна."
                    />
                    <InputGroupAddon align="block-end">
                      <Separator orientation="vertical" className="h-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className="relative z-9999 flex flex-col gap-2">
                  <label className="text-start">Шалгалт үүсгэх төрөл</label>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="hover:border-primary focus:border-primary flex items-center justify-between h-10 w-full text-base px-[15px] py-2 border border-stroke-line rounded-lg text-foreground"
                      >
                        <span
                          className={
                            selectedType === "YESH_LIBRARY" ||
                            selectedType === "SHUFFLE" || selectedType === "TEACHER_LIBRARY"
                              ? "text-foreground"
                              : "text-label-caption"
                          }
                        >
                          {selectedType === "SHUFFLE"
                            ? "Шалгалтын асуулт шаафл хийнэ"
                            : selectedType === "YESH_LIBRARY"
                            ? "Тестийн сан ашиглах"
                            : selectedType === "TEACHER_LIBRARY"
                            ? "Багшийн сан ашиглах"
                            : "Шалгалт үүсгэх төрөл"}
                        </span>

                        <ChevronDown className="w-4 h-4 ml-2" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-(--radix-dropdown-menu-trigger-width) z-9999"
                      align="start"
                    >
                      <DropdownMenuItem
                        onClick={() => setValue("type", "SHUFFLE")}
                      >
                        Шалгалтын асуулт шаафл хийнэ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setValue("type", "YESH_LIBRARY")}
                      >
                        Тестийн сан ашиглах
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setValue("type", "TEACHER_LIBRARY")}
                      >
                        Багш шалгалт үүсгэх
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="relative z-9999 flex flex-col text-start">
                    <label className="">Анги сонгох</label>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="text-foreground hover:border-primary focus:border-primary flex items-center justify-between h-10 w-full text-base px-[15px] py-2 border border-stroke-line rounded-lg"
                        >
                          <span>
                            {selectedClass
                              ? `${selectedClass}-р анги`
                              : "12-р анги"}
                          </span>
                          <ChevronDown className="w-4 h-4 ml-2" />
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

                  <div className="relative z-9999 flex flex-col text-start">
                    <label className="">Вариант</label>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="hover:border-primary focus:border-primary flex items-center justify-between h-10 w-full text-base px-[15px] py-2 border border-stroke-line rounded-lg text-foreground"
                        >
                          <span
                            className={
                              selectedVariant
                                ? "text-foreground"
                                : "text-label-caption"
                            }
                          >
                            {selectedVariant
                              ? selectedVariant
                              : "Вариант сонгох"}
                          </span>

                          <ChevronDown className="w-4 h-4 ml-2" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) z-9999"
                        align="start"
                      >
                        {["1", "2", "3", "4", "5"].map((variant) => (
                          <DropdownMenuItem
                            key={variant}
                            onClick={() => setValue("variantCount", variant)}
                            className="text-accent-foreground"
                          >
                            {variant}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {selectedType !== "YESH_LIBRARY" && (
                  <div className="grid grid-cols-2 gap-5">
                    <div className="relative z-9999 flex flex-col text-start">
                      <label className="">Асуултын тоо</label>

                      <Input
                        type="number"
                        placeholder="Асуултын тоо"
                        className="hover:border-primary border"
                        {...register("questionCount", {
                          required: "Асуултын тоо оруулна уу",
                          min: {
                            value: 1,
                            message: "Хамгийн багадаа 1 асуулт байх ёстой",
                          },
                        })}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-", "."].includes(e.key))
                            e.preventDefault();
                        }}
                      />
                      {errors.questionCount && (
                        <span className="text-negative text-xs ml-2">
                          {errors.questionCount.message}
                        </span>
                      )}
                    </div>

                    <div className="relative z-9999 flex flex-col text-start">
                      <label className="">Тест бөглөх хугацаа</label>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="hover:border-primary focus:border-primary flex items-center justify-between h-10 w-full text-base px-[15px] py-2 border border-stroke-line rounded-lg text-foreground"
                          >
                            <span
                              className={
                                selectedDuration
                                  ? "text-foreground"
                                  : "text-label-caption"
                              }
                            >
                              {selectedDuration
                                ? `${selectedDuration} минут`
                                : "Хугацаа оруулах"}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          className="w-(--radix-dropdown-menu-trigger-width) z-9999"
                          align="start"
                        >
                          {["30", "45", "60", "90", "120"].map((duration) => (
                            <DropdownMenuItem
                              key={duration}
                              onClick={() => setValue("duration", duration)}
                              className="text-black hover:bg-gray-100"
                            >
                              {duration} минут
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {errors.duration && (
                        <span className="text-negative text-xs ml-2">
                          {errors.duration.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}
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
                {loading ? "Үүсгэж байна..." : "Шалгалт нээх"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
