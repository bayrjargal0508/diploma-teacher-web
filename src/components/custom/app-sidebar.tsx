"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "../providers/sidebar-provider";
import { Button } from "../ui/button";
import { LogIn, Plus, MoreHorizontal } from "lucide-react";
import LogoutConfirmModal from "./log-out";
import { clearToken } from "@/actions/cookies";
import CreateClass from "../dashboard/create-class-modal";
import { classroom } from "@/actions";
import { toast } from "react-toastify";
import { useTitleContext } from "../providers/title-provider";
import { useClassroomRefresh } from "../providers/refresh-provider";

type MenuItemProps = {
  src: string;
  label: string;
  onClick?: () => void;
  className?: string;
  href?: string;
};
const MenuItem = ({ src, label, href, onClick, className }: MenuItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = href && pathname.startsWith(href);

  return (
    <button
      type="button"
      onClick={onClick ? onClick : () => href && router.push(href)}
      className={`flex w-full items-center gap-2 rounded-lg px-[15px] py-2.5 cursor-pointer transition-colors
        ${isActive ? "bg-accent text-black" : "hover:bg-accent "}
        focus:outline-none group-data-[collapsible=icon]:justify-center ${
          className || ""
        }`}
    >
      <Image alt={label} src={src} height={24} width={24} />
      <p className="group-data-[collapsible=icon]:hidden subTitle">{label}</p>
    </button>
  );
};
const AppSidebar = () => {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [classroomIcon, setClassroomIcon] = useState<string | null>(null);
  const { setTitle } = useTitleContext();
  const { triggerRefresh } = useClassroomRefresh();

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    clearToken();
    setIsLogoutModalOpen(false);
    router.push("/");
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const fetchClassroomData = async () => {
    const res = await classroom();
    if (res.result && Array.isArray(res.data) && res.data.length > 0) {
      setClassroomIcon(res.data[0].classroomIcon);
    } else {
      toast.error(res.message || "Ангийн жагсаалт авахад алдаа гарлаа.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchClassroomData();
    };
    loadData();
  }, []);

  const handleNavigation = (path: string, label: string) => {
    setTitle(label);
    router.push(path);
  };

  const handleClassroomCreated = () => {
    fetchClassroomData();
    triggerRefresh();
  };

  return (
    <>
      <Sidebar collapsible="icon" className="p-5">
        <div className="flex flex-col relative overflow-hidden gap-[30px] h-full">
          <div className="relative h-10">
            <div className="w-48">
              <div className="relative left-0 group-data-[collapsible=icon]:left-2 w-fit transition-all duration-200">
                <Image
                  alt="logo"
                  src="/assets/photos/logo/logo-light.png"
                  height={151}
                  width={725}
                  className="h-10 w-48 visible dark:invisible"
                />
                <Image
                  alt="logo"
                  src="/assets/photos/logo/logo-dark.png"
                  height={151}
                  width={725}
                  className="invisible absolute left-0 top-0 h-10 w-48 dark:visible"
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full flex items-center justify-center gap-2 text-center overflow-hidden group-data-[collapsible=icon]:justify-start"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="size-5" />
            <span className="group-data-[collapsible=icon]:hidden">
              Анги үүсгэх
            </span>
          </Button>

          <div className="flex flex-col gap-5">
            <MenuItem
              src={classroomIcon || "/assets/photos/default-classroom-icon.png"}
              label="Анги"
              href="/dashboard/classroom"
              onClick={() => handleNavigation("/dashboard/classroom", "Анги")}
            />

            <MenuItem
              src="/assets/photos/board-icon.png"
              label="Самбар"
              href="/dashboard/board"
              onClick={() => handleNavigation("/dashboard/board", "Самбар")}
            />
            <MenuItem
              src="/assets/photos/exam-icon.png"
              label="Шалгалт"
              href="/dashboard/exam"
              onClick={() => handleNavigation("/dashboard/exam", "Шалгалт")}
            />
            <MenuItem
              src="/assets/photos/archive-icon.png"
              label="Архив"
              href="/dashboard/archive"
              onClick={() => handleNavigation("/dashboard/archive", "Архив")}
            />
             <MenuItem
              src="/assets/photos/chest-icon.png"
              label="Даалгавар"
              href="/dashboard/assign"
              onClick={() => handleNavigation("/dashboard/assign", "Даалгавар")}
            />
          </div>

          <div className="mt-auto flex flex-col items-start gap-5">
            <div className="w-full group-data-[collapsible=icon]:hidden flex flex-col gap-5 ml-2">
              <p className="subTitle">Тусламж</p>
              <p className="subTitle">Санал хүсэлт</p>
            </div>

            <div className="hidden w-full justify-center group-data-[collapsible=icon]:flex">
              <MoreHorizontal size={24} />
            </div>

            <button
              onClick={handleLogoutClick}
              className="ml-2 flex items-center gap-2 text-primary subTitle group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:justify-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <LogIn size={24} />
              <span>Гарах</span>
            </button>

            <button
              title="close"
              onClick={handleLogoutClick}
              className="hidden w-full justify-center group-data-[collapsible=icon]:flex cursor-pointer hover:opacity-80 transition-opacity"
            >
              <LogIn size={24} className="text-primary" />
            </button>

            <div className="flex flex-col items-start gap-2 group-data-[collapsible=icon]:items-center">
              <p className="text-[8px] text-[#94A3B8]">Developed by</p>

              <div className="group-data-[collapsible=icon]:hidden">
                <Image
                  alt="powered-logo"
                  src="/assets/photos/logo/powered-logo.png"
                  height={24}
                  width={90}
                />
              </div>

              <div className="hidden justify-center group-data-[collapsible=icon]:flex">
                <Image
                  alt="powered-small-logo"
                  src="/assets/photos/logo/powered-small-logo.png"
                  height={30}
                  width={30}
                />
              </div>
            </div>
          </div>
        </div>
      </Sidebar>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        title="Та гарахдаа итгэлтэй байна уу?"
      />
      {isOpen && (
        <CreateClass
          onClose={() => setIsOpen(false)}
          onSuccess={handleClassroomCreated}
        />
      )}
    </>
  );
};

export default AppSidebar;
