'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { VALUE_BALANCE_DATA } from './dashboardData';

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-modal p-3 text-sm min-w-[140px]">
      <p className="font-600 text-foreground mb-2">{label} 2026</p>
      {payload.map((entry) => (
        <div key={`bar-tip-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-600 text-foreground tabular-nums">₹{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ValueBalanceChart() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="mb-5">
        <h3 className="text-base font-600 text-foreground">Swap Value Exchange</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Monthly value given vs received (INR estimate)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={VALUE_BALANCE_DATA}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="square"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
          <Bar
            dataKey="given"
            name="Given"
            fill="var(--accent)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="received"
            name="Received"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
