"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import EmptyPage from "../empty";
import MonsterLottie from "@/components/ui/loader";
import MenuSidebar from "@/components/icons/menu-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AssignSendModal from "./assign-send-modal";

type Answer = { text: string; isCorrect: boolean };
type AssignItem = {
  _id: string;
  contentName: string;
  contentId: string;
  subject: string;
  question: string;
  questionType: "truefalse" | "multiple";
  answers: Answer[];
  createdAt?: string;
};

type Props = {
  contentName?: string;
};

const AssignContent = ({ contentName }: Props) => {
  const [items, setItems] = useState<AssignItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSlides, setActiveSlides] = useState<Record<string, number>>({});
  const [isOpenSend, setIsOpenSend] = useState(false);
  const [selectedAssignId, setSelectedAssignId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:4000/api/assignments");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Assign list error", err);
        setError("Даалгаврын жагсаалт татахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const nextSlide = (id: string) => {
    setActiveSlides((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, 2),
    }));
  };

  const prevSlide = (id: string) => {
    setActiveSlides((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background rounded-[10px]">
        <MonsterLottie />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  const filteredItems = items.filter((item) =>
    contentName ? item.contentName === contentName : true
  );

  if (!filteredItems.length) {
    return (
      <EmptyPage
        title="Одоогоор даалгавар байхгүй байна"
        describe=""
        src="/assets/photos/empty-monster.png"
        buttontag=""
      />
    );
  }

  return (
    <div className="p-6 bg-background-secondary mt-4 rounded-[10px] border-[0.6px] border-b-4 border-stroke-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const currentSlide = activeSlides[item._id] || 0;
          const slides = ["subject", "question", "answers"];

          return (
            <div
              key={item._id}
              className="rounded-lg border border-stroke-border bg-background-secondary overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-stroke-border bg-background flex justify-between items-center">
                <div className="flex flex-col items-start justify-start gap-2 mb-2">
                  <p className="font-semibold">{item.contentName}</p>
                  <span className="text-xs text-primary whitespace-nowrap">
                    {item.questionType === "truefalse"
                      ? "Үнэн/Худал"
                      : "Олон хариулт"}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      title="more"
                      className="rounded-[10px] hover:bg-background-secondary p-0.5 size-8 flex items-center justify-center cursor-pointer"
                    >
                      <MenuSidebar />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="w-48 p-2 border border-stroke-line rounded-[10px] bg-background-secondary"
                  >
                    <DropdownMenuItem>
                      <p
                        className="flex items-center justify-start gap-1.5 text-sm font-semibold"
                        onClick={() => {
                          setSelectedAssignId(item._id);
                          setIsOpenSend(true);
                        }}
                      >
                        <Send /> Сурагч руу илгээх
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-5 min-h-[300px] flex flex-col justify-between">
                {/* Subject Slide */}
                {currentSlide === 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-label-paragraphy mb-3">
                      СУДЛАХ ХИЧЭЭЛ
                    </h3>

                    <div
                      className={`prose prose-sm max-w-none text-gray-800 overflow-hidden ${
                        expanded ? "max-h-none" : "max-h-[120px]"
                      }`}
                      dangerouslySetInnerHTML={{ __html: item.subject }}
                    />

                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2 text-sm font-medium text-primary hover:underline"
                    >
                      {expanded ? "Хураах" : "Илүү ихийг харах . . ."}
                    </button>
                  </div>
                )}

                {/* Question Slide */}
                {currentSlide === 1 && (
                  <div>
                    <h3 className="text-sm font-semibold text-label-paragraphy mb-3">
                      АСУУЛТ
                    </h3>
                    <div
                      className="prose prose-sm max-w-none text-gray-800 font-semibold"
                      dangerouslySetInnerHTML={{ __html: item.question }}
                    />
                  </div>
                )}

                {/* Answers Slide */}
                {currentSlide === 2 && (
                  <div>
                    <h3 className="text-sm font-semibold text-label-paragraphy mb-3">
                      ХАРИУЛТ
                    </h3>
                    <div className="space-y-3">
                      {item.answers?.map((ans, idx) => {
                        const text =
                          item.questionType === "truefalse"
                            ? `${ans.text} - ${idx === 0 ? "True" : "False"}`
                            : ans.text;

                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-2 rounded ${
                              ans.isCorrect
                                ? "text-positive font-medium"
                                : "text-label-paragraphy"
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center shrink-0 ${
                                ans.isCorrect
                                  ? "text-background-secondary bg-positive rounded-full w-7 h-7 text-sm font-semibold"
                                  : "text-primary w-7 h-7 text-sm font-semibold"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm">{text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="p-4 border-t border-stroke-border flex justify-between items-center">
                <button
                  onClick={() => prevSlide(item._id)}
                  disabled={currentSlide === 0}
                  className="p-2 rounded-lg hover:bg-stroke-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} className="text-label-paragraphy" />
                </button>
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-sm text-label-paragraphy font-medium">
                    {currentSlide + 1} / 3
                  </span>
                  <div className="flex gap-1 justify-center">
                    {slides.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all ${
                          idx === currentSlide
                            ? "bg-primary w-8"
                            : "bg-gray-300 w-4"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => nextSlide(item._id)}
                  disabled={currentSlide === 2}
                  className="p-2 rounded-lg hover:bg-stroke-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} className="text-label-paragraphy" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {isOpenSend && selectedAssignId && (
        <AssignSendModal
          assignId={selectedAssignId}
          onClose={() => setIsOpenSend(false)}
        />
      )}
    </div>
  );
};

export default AssignContent;
