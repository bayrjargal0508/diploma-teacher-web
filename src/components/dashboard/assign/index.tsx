"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AllExamContent } from "@/lib/types";
import { classroom, manageAllSubjectContentName } from "@/actions";
import { Button } from "@/components/ui/button";
import AssignContent from "./assign-content";
import { toast } from "react-toastify";

const Assignlist = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<AllExamContent[] | null>(null);

  const currentTab = searchParams.get("tab") || "0";

  useEffect(() => {
    const loadData = async () => {
      const classroomRes = await classroom();
      let targetSubjectName = "";

      if (
        classroomRes.result &&
        Array.isArray(classroomRes.data) &&
        classroomRes.data.length > 0
      ) {
        targetSubjectName = classroomRes.data[0].classroomSubjectName;
      } else {
        toast.error(classroomRes.message);
      }

      const contentData = await manageAllSubjectContentName();
      if (contentData?.list) {
        const filteredContent = targetSubjectName
          ? contentData.list.filter(
              (item) => item.subjectName === targetSubjectName
            )
          : contentData.list;

        setContent(filteredContent);
        console.log("Filtered content:", filteredContent);
      }
    };

    loadData();
  }, []);

  const handleTabChange = (tabValue: string) => {
    router.push(`/dashboard/assign?tab=${tabValue}`);
  };

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-stroke-border">
        {content?.map((item, index) => (
          <button
            key={item.id ?? `tab-${index}`}
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
              <Button
                className="w-40"
                onClick={() =>
                  router.push(
                    `/dashboard/assign/create-assign?id=${
                      content?.[parseInt(currentTab)]?.id
                    }`
                  )
                }
              >
                Даалгавар үүсгэх
              </Button>
            </div>
            {/* {open && (
              <DocsEditor
                onClose={() => setOpen(false)}
                contentItem={{
                  id: content[parseInt(currentTab)].id,
                  name: content[parseInt(currentTab)].name,
                }}
              />
            )} */}
          </div>
        )}
      </div>
      <AssignContent contentName={content?.[parseInt(currentTab)]?.name} />
    </div>
  );
};

export default Assignlist;
