"use client";

import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "@/components/lotties/default-loader.json";

interface DefaultLoaderProps {
  size?: number;
  className?: string;
}

const DefaultLoader: React.FC<DefaultLoaderProps> = ({
  size = 120,
  className,
}) => {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Lottie
        animationData={loaderAnimation}
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default DefaultLoader;
