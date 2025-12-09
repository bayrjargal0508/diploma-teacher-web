"use client";

import Lottie from "lottie-react";
import animationData from "../lotties/loader.json";
import { CSSProperties } from "react";

interface MonsterLottieProps {
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
}

export default function MonsterLottie({
  loop = true,
  autoplay = true,
  style,
}: MonsterLottieProps) {
  return (
    <div style={{ width: 300, height: 300, ...style }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
