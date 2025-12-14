import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TrendDataItem {
  month: string;
  value: number;
}

interface DonutChartProps {
  trendData?: TrendDataItem[];
}

export default function TrendAreaChart({ trendData }: DonutChartProps) {
  const safeTrend = trendData ?? [];

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <p className="text-base font-semibold">Дундаж үзүүлэлт</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <p className="flex items-center gap-1 border rounded-[10px] px-3 py-1 border-border-stroke text-sm text-label-caption">
              Сүүлийн 6 сар <ChevronDown size={16} />
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white">
            <DropdownMenuItem>Сүүлийн 1 сар</DropdownMenuItem>
            <DropdownMenuItem>Сүүлийн 3 сар</DropdownMenuItem>
            <DropdownMenuItem>Сүүлийн 6 сар</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart
          data={safeTrend}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#FFD88F" stopOpacity={0.8} />
              <stop offset="90%" stopColor="#FFD88F" stopOpacity={0.2} />
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

          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: "#6B7280", fontSize: 14 }}
          />

          <Tooltip
            formatter={(value: number) => [`${value}%`, "Үзүүлэлт"]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />

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
  );
}
