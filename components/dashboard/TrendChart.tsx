"use client";

import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  useEffect,
  useState,
} from "react";

interface ChartItem {
  day: string;
  value: number;
}

export default function TrendChart() {

  const [data, setData] =
    useState<ChartItem[]>([]);

  useEffect(() => {

    const fetchChart =
      async () => {

        try {

          const res =
            await fetch(
              "/api/checkin/chart"
            );

          const result =
            await res.json();

          if (
            result.status === "success"
          ) {

            setData(
              result.data
            );
          }

        } catch (error) {

          console.error(
            "Chart Error:",
            error
          );
        }
      };

    fetchChart();

  }, []);

  return (

    <div className="bg-[#1a1a22] p-6 rounded-2xl border border-gray-800">

      <h3 className="text-white font-semibold mb-4">

        7-Day Trend

      </h3>

      <div className="w-full h-[260px] min-h-[200px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >

            {/* GRADIENT */}
            <defs>

              <linearGradient
                id="colorScore"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#a855f7"
                  stopOpacity={0.5}
                />

                <stop
                  offset="95%"
                  stopColor="#a855f7"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            {/* GRID */}
            <CartesianGrid
              stroke="#2a2a35"
              strokeDasharray="3 3"
            />

            {/* X AXIS */}
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
            />

            {/* Y AXIS */}
            <YAxis
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />

            {/* TOOLTIP */}
            <Tooltip
              content={({ active, payload, label }) => {

                if (
                  active &&
                  payload &&
                  payload.length
                ) {

                  return (

                    <div className="bg-[#111118] border border-zinc-800 rounded-xl px-4 py-3 shadow-xl">

                      <p className="text-zinc-400 text-sm mb-1">
                        {label}
                      </p>

                      <p className="text-purple-400 font-semibold">
                        Burnout Score: {payload[0].value}%
                      </p>

                    </div>
                  );
                }

                return null;
              }}
            />

            {/* AREA */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#colorScore)"
              fillOpacity={1}
            />

            {/* LINE */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#a855f7"
              strokeWidth={3}

              dot={{
                r: 4,
                fill: "#a855f7",
                strokeWidth: 0,
              }}

              activeDot={{
                r: 7,
                fill: "#c084fc",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}