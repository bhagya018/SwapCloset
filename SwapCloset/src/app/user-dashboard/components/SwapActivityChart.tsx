'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SWAP_ACTIVITY_DATA } from './dashboardData';

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
    <div className="bg-card border border-border rounded-xl shadow-modal p-3 text-sm">
      <p className="font-600 text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.name}`} className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-600 text-foreground tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function SwapActivityChart() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-600 text-foreground">Swap Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last 8 weeks — requests sent, received & completed
          </p>
        </div>
        <span className="text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Jun 9 – Jul 28, 2026
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={SWAP_ACTIVITY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradReceived" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--info)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--info)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="received"
            name="Received"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#gradReceived)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--accent)' }}
          />
          <Area
            type="monotone"
            dataKey="sent"
            name="Sent"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#gradSent)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--primary)' }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="var(--info)"
            strokeWidth={2}
            fill="url(#gradCompleted)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--info)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
