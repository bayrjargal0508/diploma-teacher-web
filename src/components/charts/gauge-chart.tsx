"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

interface AverageScoreGaugeProps {
  percent: number;
}
type ClassKey = string;
export default function AverageScoreGauge({ percent }: AverageScoreGaugeProps) {
  const [class1, setClass1] = useState<ClassKey>("class1");

  return (
    <div className="flex flex-col w-full h-full bg-background-secondary rounded-md p-4 ">
      <div className="flex items-center justify-between">
        <p className="subTitle mb-2">Дундаж дүн ба Ирц</p>
        <select
          title="classes"
          value={class1}
          onChange={(e) => setClass1(e.target.value as ClassKey)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="class1">Анги 1</option>
          <option value="class2">Анги 2</option>
        </select>
      </div>

      <GaugeComponent
        value={percent * 100}
        type="radial"
        labels={{
          tickLabels: {
            type: "inner",
            ticks: [
              { value: 20 },
              { value: 40 },
              { value: 60 },
              { value: 80 },
              { value: 100 },
            ],
          },
        }}
        arc={{
          colorArray: ["#F7C56D", "#E5606A", "#00A5E3", "#00C287"],
          subArcs: [
            { limit: 25 },
            { limit: 50 },
            { limit: 75 },
            { limit: 100 },
          ],
          padding: 0.02,
          width: 0.2,
        }}
        pointer={{
          elastic: true,
          animationDelay: 0,
        }}
      />
      <p className="text-xl font-bold mt-2 text-center">
        {(percent * 100).toFixed(1)}%
      </p>
      <div className="flex gap-2 items-center justify-center text-xs">
        <div className="size-5 bg-[#00C287] rounded-full" />
        <p>
          {" "}
          <span className="font-semibold">A</span> 90% - 100%
        </p>
        <div className="size-5 bg-[#00A5E3] rounded-full" />
        <p>
          {" "}
          <span className="font-semibold">B</span> 80% - 90%{" "}
        </p>
        <div className="size-5 bg-[#E5606A] rounded-full" />
        <p>
          {" "}
          <span className="font-semibold">C</span> 70% - 80%{" "}
        </p>
        <div className="size-5 bg-[#F7C56D] rounded-full" />
        <p>
          <span className="font-semibold">D</span> 60% - 70%
        </p>
      </div>
    </div>
  );
}
