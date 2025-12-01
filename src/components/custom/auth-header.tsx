import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

const AuthHeader = () => {
  return (
    <div className="flex justify-between px-8 py-5 bg-white">
      <Image
        src="/assets/photos/logo/logo-light.png"
        width={120}
        height={50}
        alt="Logo"
      />
      <X size={24} />
    </div>
  );
};

export default AuthHeader;
