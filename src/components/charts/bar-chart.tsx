"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AvgScoreChartProps {
  data: { name: string; avg: number; attendance: number }[];
}
type ClassKey = string;

export default function AvgScoreChart({ data }: AvgScoreChartProps) {
  const [class1, setClass1] = useState<ClassKey>("class1");
  return (
    <div className="bg-background-secondary rounded-md w-full h-full p-4">
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

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avg" fill="#f87171" name="Дундаж дүн" />
          <Bar dataKey="attendance" fill="#4ade80" name="Ирц" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}