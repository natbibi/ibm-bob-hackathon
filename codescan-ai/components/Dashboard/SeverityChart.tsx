'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertCircle } from 'lucide-react';

interface SeverityChartProps {
  breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export default function SeverityChart({ breakdown }: SeverityChartProps) {
  const data = [
    { name: 'Critical', value: breakdown.critical, color: '#EF4444' },
    { name: 'High', value: breakdown.high, color: '#F97316' },
    { name: 'Medium', value: breakdown.medium, color: '#F59E0B' },
    { name: 'Low', value: breakdown.low, color: '#10B981' },
  ];

  const total = breakdown.critical + breakdown.high + breakdown.medium + breakdown.low;
  const hasData = total > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E1E2E] border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }}>
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = () => (
    <div className="flex justify-center gap-6 mt-6">
      {data.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-300">
            {entry.name}: <span className="font-bold" style={{ color: entry.color }}>{entry.value}</span>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#1E1E2E] border border-white/10 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Severity Breakdown</h2>
        <AlertCircle className="w-5 h-5 text-primary" />
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-xl font-semibold text-success mb-2">No vulnerabilities found!</p>
          <p className="text-gray-400">Your code looks great</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {renderCustomLegend()}
        </>
      )}
    </div>
  );
}

// Made with Bob
