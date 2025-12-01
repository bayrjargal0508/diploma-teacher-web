    "use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ClassroomRefreshContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const ClassroomRefreshContext = createContext<ClassroomRefreshContextType | undefined>(
  undefined
);

export const ClassroomRefreshProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <ClassroomRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </ClassroomRefreshContext.Provider>
  );
};

export const useClassroomRefresh = () => {
  const context = useContext(ClassroomRefreshContext);
  if (context === undefined) {
    throw new Error("useClassroomRefresh must be used within a ClassroomRefreshProvider");
  }
  return context;
};