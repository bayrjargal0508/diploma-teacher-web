"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ExamTotalContextType {
  getTotalForClassroom: (classroomId: string) => number;
  setTotalForClassroom: (classroomId: string, value: number) => void;
}

const ExamTotalContext = createContext<ExamTotalContextType | null>(null);

interface ExamTotalProviderProps {
  children: ReactNode;
}

export function ExamTotalProvider({ children }: ExamTotalProviderProps) {
  const [totals, setTotals] = useState<Record<string, number>>({});

  const getTotalForClassroom = (classroomId: string): number => {
    return totals[classroomId] || 0;
  };

  const setTotalForClassroom = (classroomId: string, value: number) => {
    setTotals(prev => ({
      ...prev,
      [classroomId]: value
    }));
  };

  return (
    <ExamTotalContext.Provider value={{ getTotalForClassroom, setTotalForClassroom }}>
      {children}
    </ExamTotalContext.Provider>
  );
}

export function useExamTotal() {
  const ctx = useContext(ExamTotalContext);
  if (!ctx) {
    throw new Error("useExamTotal must be used inside ExamTotalProvider");
  }
  return ctx;
}