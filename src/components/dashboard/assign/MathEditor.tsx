"use client";

import { useEffect, useRef } from "react";
import "mathlive";

// 1) JSX-д custom элементийн type declare хийх
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": any;
    }
  }
}

// 2) Props type тодорхойлох
interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MathEditor({ value, onChange }: MathEditorProps) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return; // 3) Null check

    el.value = value;

    const handler = () => {
      onChange(el.value);
    };

    el.addEventListener("input", handler);

    return () => {
      el.removeEventListener("input", handler);
    };
  }, [value, onChange]); // 4) Dependencies fix

  return (
    <math-field
      ref={ref}
      virtual-keyboard-mode="off"
      style={{
        width: "100%",
        minHeight: "200px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "18px",
        background: "white",
      }}
    ></math-field>
  );
}
