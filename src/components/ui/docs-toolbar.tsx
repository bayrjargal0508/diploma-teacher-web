"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Underline, X, Sigma } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatText, FormatType } from "@/lib/formatText";


interface Types {
  onClose: () => void;
}

export default function DocsEditor({ onClose }: Types) {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState<"question" | "answer">("question");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (type: FormatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = text.substring(start, end);
    const formatted = formatText(type, selected);

    const newText = text.substring(0, start) + formatted + text.substring(end);
    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formatted.length);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/50 px-4 w-full">
      <div className="w-[600px] bg-background-secondary p-3 rounded-[10px]">
        <div className="flex items-center justify-between mb-3">
          <p className="h2">Даалгавар үүсгэх</p>
          <X onClick={onClose} className="cursor-pointer hover:text-primary" />
        </div>

        <div>
          <div className="flex gap-2 mb-4 border-b border-stroke-border">
            <button
              onClick={() => setActiveTab("question")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "question"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Асуулт үүсгэх
            </button>

            <button
              onClick={() => setActiveTab("answer")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "answer"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Хариулт үүсгэх
            </button>
          </div>

          {activeTab === "question" && (
            <>
              <p className="subTitle mb-3">Асуулт үүсгэх</p>

              <div className="flex items-center gap-2 p-2 border rounded-md bg-background shadow-sm">
                <button
                  onClick={() => applyFormat("bold")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Bold size={18} />
                </button>

                <button
                  onClick={() => applyFormat("italic")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Italic size={18} />
                </button>

                <button
                  onClick={() => applyFormat("underline")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Underline size={18} />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                  onClick={() => applyFormat("h1")}
                  className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  H1
                </button>

                <button
                  onClick={() => applyFormat("h2")}
                  className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  H2
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                  onClick={() => applyFormat("math")}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Math formula"
                >
                  <Sigma size={18} />
                </button>
              </div>

              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Энд бичнэ үү..."
                className="mt-3 h-64 border-stroke-border focus:ring-primary bg-background"
              />
            </>
          )}

          {activeTab === "answer" && (
            <>
              <div className="flex gap-4 my-3 items-start justify-start flex-col">
                <p className="subTitle w-full">Хариулт үүсгэх</p>
                <Input type="number" placeholder="Хариултын тоо" className="w-40" />
              </div>

              <div className="flex gap-1 items-center justify-center">
                <Input placeholder="Хариулт оруулана уу" />
                <Input type="radio" className="size-5" />
                <span>True</span>
                <Input type="radio" className="size-5" />
                <span>False</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <Button variant="secondary" onClick={onClose}>
            Буцах
          </Button>
          <Button className="w-[100px]">Хадгалах</Button>
        </div>
      </div>
    </div>
  );
}
