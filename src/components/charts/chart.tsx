import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AttendanceDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface TrendDataItem {
  month: string;
  value: number;
}

interface DonutChartProps {
  attendanceData?: AttendanceDataItem[];
  trendData?: TrendDataItem[];
}

export default function DonutChart({
  attendanceData,
  trendData,
}: DonutChartProps) {
  const [selectedMonth, setSelectedMonth] = useState("Сүүлийн 6 сар");

  // --- FIX: Safe fallback ---
  const safeAttendance = attendanceData ?? [];
  const safeTrend = trendData ?? [];

  const totalPercentage = safeAttendance.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-background-secondary rounded-md p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[16px] font-semibold text-foreground">
          Ангийн дундаж үзүүлэлт
        </h2>
        <div className="relative">
          <select
            title="month selector"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-background border border-gray-300 rounded-lg px-2 py-1 pr-10 text-sm font-medium text-foreground cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Сүүлийн 6 сар</option>
            <option>Сүүлийн 3 сар</option>
            <option>Сүүлийн сар</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: 320, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeAttendance}
                cx="50%"
                cy="100%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                startAngle={180}
                endAngle={0}
              >
                {safeAttendance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Total */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            <div className="text-sm font-medium text-label-caption mb-1">
              Бүх оноо
            </div>
            <div className="text-4xl font-bold text-foreground">
              {totalPercentage}%
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {safeAttendance.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-base font-medium text-foreground">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Area Chart */}
      <div className="flex">
        <div className="flex mb-4">
          <div className="text-sm text-label-caption space-y-5">
            <div>100%</div>
            <div>75%</div>
            <div>50%</div>
            <div>25%</div>
            <div>0%</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={safeTrend}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD88F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FFD88F" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="0"
              stroke="#f0f0f0"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 14 }}
            />

            <YAxis hide />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFB84D"
              strokeWidth={3}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
