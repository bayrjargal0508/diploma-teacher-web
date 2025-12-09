"use client";

import GaugeComponent from "react-gauge-component";
interface AverageScoreGaugeProps {
  percent: number;
}
export default function GaugeChart({ percent }: AverageScoreGaugeProps) {
  return (
    <div className="bg-background-secondary rounded-md w-full h-full p-4">
      <h2 className="font-semibold text-lg mb-4">Дундаж оноо</h2>

      <GaugeComponent
        value={percent * 100}
        type="semicircle"
        arc={{
          width: 0.1,
          padding: 0.01,
          // cornerRadius: 1,
          subArcs: [
            { limit: 25, color: "#F4B63F" }, // D (60–70)
            { limit: 50, color: "#E06C6C" }, // C (70–80)
            { limit: 75, color: "#70B7E0" }, // B (80–90)
            { limit: 100, color: "#4CAF50" }, // A (90–100)
          ],
        }}
        pointer={{
          elastic: true,
          animationDuration: 1500,
        }}
        labels={{
          valueLabel: { hide: true },
        }}
      />
      <p className="text-center text-4xl font-extrabold">{percent * 100}%</p>

      <div className="flex justify-center items-center gap-2 mt-10 text-sm">
        <div className="flex items-center gap-1">
          <span className="size-5 bg-green-500 rounded-full" /> A 90% - 100%
        </div>
        <div className="flex items-center gap-1">
          <span className="size-5 bg-blue-400 rounded-full" /> B 80% - 90%
        </div>
        <div className="flex items-center gap-1">
          <span className="size-5 bg-red-400 rounded-full" /> C 70% - 80%
        </div>
        <div className="flex items-center gap-1">
          <span className="size-5 bg-yellow-500 rounded-full" /> D 60% - 70%
        </div>
      </div>
    </div>
  );
}
