"use client";

import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ClassKey = "class1" | "class2";

interface ChartItem {
  subject: string;
  group1: number;
  group2: number;
}

interface GroupSkillRadarChartProps {
  dataSets: Record<ClassKey, ChartItem[]>;
}

export default function GroupSkillRadarChart({
  dataSets,
}: GroupSkillRadarChartProps) {
  const [class1, setClass1] = useState<ClassKey>("class1");
  const [class2, setClass2] = useState<ClassKey>("class2");

  const mergedData =
    dataSets[class1].map((item, index) => ({
      subject: item.subject,
      group1: item.group1,
      group2: dataSets[class2][index]?.group2 ?? 0,
    })) || [];

  return (
    <div className="rounded-md p-4 w-full h-full bg-background-secondary">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">Бүлгийн үр чадвар</h2>
        <div className="flex gap-2">
          <select
            title="classes"
            value={class1}
            onChange={(e) => setClass1(e.target.value as ClassKey)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="class1">Анги 1</option>
            <option value="class2">Анги 2</option>
          </select>
          <select
            title="classes"
            value={class2}
            onChange={(e) => setClass2(e.target.value as ClassKey)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="class1">Анги 1</option>
            <option value="class2">Анги 2</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={mergedData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Бүлэг 1"
            dataKey="group1"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
          />
          <Radar
            name="Бүлэг 2"
            dataKey="group2"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
