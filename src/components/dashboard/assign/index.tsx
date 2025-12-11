"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ExamContent } from "@/lib/types";
import { examShuffleContentNoId } from "@/actions";
import DocsEditor from "@/components/ui/docs-toolbar";
import { Button } from "@/components/ui/button";
import AssignContent from "./assign-content";

const Assignlist = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<ExamContent[] | null>(null);
  const [open, setOpen] = useState(false);

  const currentTab = searchParams.get("tab") || "0";

  useEffect(() => {
    examShuffleContentNoId().then((res) => {
      if (res?.data) {
        setContent(Array.isArray(res.data) ? res.data : [res.data]);
      }
    });
  }, []);

  const handleTabChange = (tabValue: string) => {
    router.push(`/dashboard/assign?tab=${tabValue}`);
  };

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-stroke-border">
        {content?.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(index.toString())}
            className={`px-4 py-2 ${
              currentTab === index.toString()
                ? "border-b-2 border-primary text-primary"
                : "text-label-paragraph"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div>
        {content && content[parseInt(currentTab)] && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold mb-4">
                {content[parseInt(currentTab)].name}
              </p>
              <Button className="w-40" onClick={() => setOpen(true)}>
                {" "}
                Даалгавар үүсгэх
              </Button>
            </div>
            {open && (
              <DocsEditor
                onClose={() => setOpen(false)}
                contentItem={{
                  id: content[parseInt(currentTab)].id,
                  name: content[parseInt(currentTab)].name,
                }}
              />
            )}
          </div>
        )}
      </div>    
      <AssignContent contentName={content?.[parseInt(currentTab)]?.name} />  
    </div>
  );
};

export default Assignlist;
