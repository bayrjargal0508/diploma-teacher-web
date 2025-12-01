"use client";

import React, { useState, useRef, useEffect } from "react";

interface VerificationInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function VerificationInput({
  value = "",
  onChange,
}: VerificationInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(4).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (value && value.length === 4) {
      const newDigits = value.split("");
      if (newDigits.join("") !== digits.join("")) {
        setDigits(newDigits);
      }
    } else if (!value && digits.some((d) => d !== "")) {
      setDigits(Array(4).fill(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    const newValue = newDigits.join("");
    onChange?.(newValue);

    if (val && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-5">
      {digits.map((digit, i) => (
        <input
          aria-label="input"
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="h-14 w-14 rounded-lg border border-primary bg-background text-center text-2xl text-primary font-bold focus:outline-none"
        />
      ))}
    </div>
  );
}
