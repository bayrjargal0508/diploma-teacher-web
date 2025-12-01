"use client";

import AuthHeader from "@/components/custom/auth-header";
import Image from "next/image";
import { usePathname } from "next/navigation";

const AuthMain = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

  let imageSrc = "/assets/photos/login-monster.png";

  if (pathname === "/register") {
    imageSrc = "/assets/photos/register-monster.png";
  } else if (pathname === "/forgot-password") {
    imageSrc = "/assets/photos/forgot-password-monster.png";
  }
  return (
    <div
      className="relative flex h-screen w-full flex-col bg-center bg-no-repeat bg-cover sm:flex"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #3A8197, #B9C7B3), url('/assets/photos/background.png')",
        backgroundBlendMode: "overlay", 
        borderRadius: 16,
      }}
    >
      <AuthHeader />
      <div className="flex h-full w-full items-center justify-center gap-[50px] px-[30px] lg:gap-[268px]">
        <div className="flex text-center flex-col items-center gap-2.5">
         <p className="profileHeader w-[380px] text-white">
            Багш таны ажлыг <span className="text-primary">100x </span>
            хөнгөвчилнө
          </p>
          <p className="w-[470px] text-[14px] text-white">
            Yesh.mn Багш модуль – хичээл төлөвлөлт, даалгавар, шалгалт, үнэлгээ,
            оролцоо, мэдээллийг нэг дор. Багш модуль – хичээл төлөвлөлт,
            даалгавар, шалгалт, үнэлгээ, оролцоо, мэдээллийг нэг дор.
          </p>
          <Image
            src={imageSrc}
            width={208}
            height={300}
            alt="loginImage"
            className="h-[370px] w-[350px] object-contain"
          />
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthMain;
