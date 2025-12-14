"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AllExamContent } from "@/lib/types";
import { classroom, manageAllSubjectContentName } from "@/actions";
import { toast } from "react-toastify";

interface ContentContextType {
  content: AllExamContent[] | null;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  targetSubjectName: string;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<AllExamContent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetSubjectName, setTargetSubjectName] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const classroomRes = await classroom();
      let subjectName = "";

      if (
        classroomRes.result &&
        Array.isArray(classroomRes.data) &&
        classroomRes.data.length > 0
      ) {
        subjectName = classroomRes.data[0].classroomSubjectName;
        setTargetSubjectName(subjectName);
      } else {
        toast.error(classroomRes.message);
      }

      const contentData = await manageAllSubjectContentName();
      if (contentData?.list) {
        const filteredContent = subjectName
          ? contentData.list.filter(
              (item) => item.subjectName === subjectName
            )
          : contentData.list;
        setContent(filteredContent);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load content";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshContent = async () => {
    await loadData();
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        refreshContent,
        targetSubjectName,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};