"use client";

import { useEffect, useState } from "react";
import MonsterLottie from "@/components/ui/loader";
import EmptyPage from "../empty";
import { ChevronDown, ChevronUp } from "lucide-react";

type Answer = { text: string; isCorrect: boolean };
type AssignItem = {
  _id: string;
  contentName: string;
  contentId: string;
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
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    {}
  );
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

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background rounded-[10px]">
        <MonsterLottie />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
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
    <div className="flex-1 overflow-y-auto space-y-6 bg-background-secondary p-2.5 rounded-[10px] mt-2">
      {filteredItems.map((item) => (
        <div
          key={item._id}
          className="rounded-[10px] border-[0.6px] border-b-4 border-stroke-border bg-background-secondary p-5 hover:bg-background cursor-pointer"
        >
          <div className="flex items-center justify-between gap-3">
            <div onClick={() => toggleQuestion(item._id)} className="grid">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center justify-start">
                  <p className="subTitle">{item.contentName}</p>
                  <p className="text-xs px-2 py-1 rounded-full border border-primary text-primary">
                    {item.questionType === "truefalse"
                      ? "Үнэн/Худал"
                      : "Олон хариулт"}
                  </p>
                </div>
                {openQuestions[item._id] ? (
                  <ChevronUp
                    size={20}
                    className="bg-background rounded-xl w-9 h-9 p-2 text-right"
                  />
                ) : (
                  <ChevronDown
                    size={20}
                    className="bg-background rounded-xl w-9 h-9 p-2"
                  />
                )}
              </div>
              {openQuestions[item._id] && (
                <div
                  className="pt-4 prose prose-sm max-w-none text-foreground font-semibold"
                  dangerouslySetInnerHTML={{ __html: item.question }}
                />
              )}
            </div>
          </div>
          {openQuestions[item._id] && (
            <div className="mt-4 space-y-3 p-3">
              {item.answers?.map((ans, idx) => {
                const text =
                  item.questionType === "truefalse"
                    ? `${ans.text} - ${idx === 0 ? "True" : "False"} `
                    : ans.text;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 ${
                      ans.isCorrect
                        ? "text-positive font-medium"
                        : "text-label-paragraph"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center ${
                        ans.isCorrect
                          ? "text-white bg-positive rounded-full w-8 h-8"
                          : "text-[#00A5E3] w-8 h-8"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssignContent;
