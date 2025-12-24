"use client";
import React from "react";
import AppSidebar from "../custom/app-sidebar";
import { SidebarTrigger } from "./sidebar-provider";
import ThemeModeToggle from "../custom/theme-mode-toggle";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTitleContext } from "./title-provider";

const ProtectedLayoutContent = ({
  children,
  fullName,
}: {
  children: React.ReactNode;
  fullName: string;
}) => {
  const { title } = useTitleContext();

  return (
    <div className="flex min:h-screen bg-background-secondary w-full">
      <AppSidebar />
      <div className="flex-1 space-y-3 overflow-visible">
        <div className="sticky top-0 z-50 bg-background-secondary pt-3">
          <div className="bg-background rounded-[10px] px-5 py-2.5 flex gap-2.5 justify-between">
            <div className="flex items-center gap-2.5">
              <SidebarTrigger />
              <h1 className="text-lg font-extrabold">{title}</h1>
            </div>

            <div className="flex items-center gap-2.5">
              <ThemeModeToggle />
              <Button
                size="icon"
                variant={"ghost"}
                className="size-11! p-2.5 rounded-2.5 bg-stroke-border"
              >
                <Image
                  alt="avatar"
                  src="/assets/photos/default-avatar.svg"
                  height={22}
                  width={30}
                  className="object-contain size-6"
                />
              </Button>
              <span className="subTitle">{fullName}</span>
            </div>
          </div>
        </div>

        <div className="@container/contents">{children}</div>
      </div>
    </div>
  );
};
export default ProtectedLayoutContent;
