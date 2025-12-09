import { isAuthenticated, getUserData } from "@/actions/cookies";
import { ClassroomRefreshProvider } from "@/components/providers/refresh-provider";
import ProtectedLayoutContent from "@/components/providers/protected-client";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { TitleProvider } from "@/components/providers/title-provider";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { ExamTotalProvider } from "@/components/providers/exam-total";

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  const isLogged = await isAuthenticated();

  if (!isLogged) {
    redirect("/login");
  }

  const userData = await getUserData();
  const fullName = userData?.fullName || "";

  return (
    <SidebarProvider>
      <TitleProvider>
        <ClassroomRefreshProvider>
          <ExamTotalProvider>
            <ProtectedLayoutContent fullName={fullName}>
              {children}
            </ProtectedLayoutContent>
          </ExamTotalProvider>
        </ClassroomRefreshProvider>
      </TitleProvider>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
