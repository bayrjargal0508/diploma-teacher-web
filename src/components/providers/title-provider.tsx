"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

const routeMap = {
  "/dashboard/class": "Анги",
  "/dashboard/board": "Самбар",
  "/dashboard/exam": "Шалгалт",
  "/dashboard/archive": "Архив",
} as const;
type RouteKey = keyof typeof routeMap;

function getTitleByRoute(pathname: string): string {
  return routeMap[pathname as RouteKey] ?? "Нүүр";
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [title, setTitle] = useState(getTitleByRoute(pathname));
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitleContext = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
};
