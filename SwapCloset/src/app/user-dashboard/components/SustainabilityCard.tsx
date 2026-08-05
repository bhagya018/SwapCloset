import React from 'react';
import { Leaf, Recycle, Wind, Droplets } from 'lucide-react';

const IMPACT_STATS = [
  { id: 'impact-co2', icon: Wind, label: 'CO₂ avoided', value: '42 kg', subtext: 'vs buying new' },
  {
    id: 'impact-water',
    icon: Droplets,
    label: 'Water saved',
    value: '8,400 L',
    subtext: 'avg per swap',
  },
  {
    id: 'impact-items',
    icon: Recycle,
    label: 'Items diverted',
    value: '14',
    subtext: 'from landfill',
  },
];

export default function SustainabilityCard() {
  const totalSwaps = 9;
  const maxSwaps = 20;
  const pct = Math.round((totalSwaps / maxSwaps) * 100);

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-positive/10 flex items-center justify-center">
          <Leaf size={16} className="text-positive" />
        </div>
        <div>
          <h3 className="text-sm font-600 text-foreground">Sustainability Impact</h3>
          <p className="text-[11px] text-muted-foreground">Your contribution since joining</p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {IMPACT_STATS?.map((stat) => {
          const Icon = stat?.icon;
          return (
            <div key={stat?.id} className="text-center bg-secondary rounded-xl p-3">
              <Icon size={16} className="text-positive mx-auto mb-1" />
              <p className="text-sm font-700 text-foreground tabular-nums">{stat?.value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {stat?.label}
              </p>
            </div>
          );
        })}
      </div>
      {/* Progress toward badge */}
      <div className="bg-muted rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-500 text-foreground">Eco Champion badge</p>
          <span className="text-xs font-600 text-primary tabular-nums">
            {totalSwaps}/{maxSwaps} swaps
          </span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {maxSwaps - totalSwaps} more swaps to unlock the badge
        </p>
      </div>
    </div>
  );
}
