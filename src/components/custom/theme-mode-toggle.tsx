"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? (
        <Image
          src="/assets/photos/sun-icon.png"
          alt="Sun"
          width={24}
          height={24}
        />
      ) : (
        <Image
          src="/assets/photos/moon-icon.png"
          alt="Moon"
          width={24}
          height={24}
        />
      )}
    </button>
  );
}
