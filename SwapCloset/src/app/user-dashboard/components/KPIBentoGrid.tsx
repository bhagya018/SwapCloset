import React from 'react';
import {
  Package,
  ArrowLeftRight,
  CheckCircle,
  DollarSign,
  Leaf,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface KPICardProps {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string };
  variant?: 'default' | 'alert' | 'positive' | 'accent';
  className?: string;
}

function KPICard({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  variant = 'default',
  className = '',
}: KPICardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    alert: 'bg-negative/5 border-negative/25',
    positive: 'bg-positive/5 border-positive/25',
    accent: 'bg-accent/5 border-accent/25',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    alert: 'bg-negative/10 text-negative',
    positive: 'bg-positive/10 text-positive',
    accent: 'bg-accent/10 text-accent',
  };

  const valueStyles = {
    default: 'text-foreground',
    alert: 'text-negative',
    positive: 'text-positive',
    accent: 'text-accent',
  };

  return (
    <div className={`rounded-2xl border p-5 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconStyles[variant]}`}
        >
          <Icon size={20} />
        </div>
        {variant === 'alert' && (
          <div className="flex items-center gap-1 bg-negative/10 text-negative text-[10px] font-600 px-2 py-1 rounded-full">
            <AlertTriangle size={10} />
            Needs attention
          </div>
        )}
      </div>
      <p className="text-[12px] font-500 text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-3xl font-700 tabular-nums mb-1 ${valueStyles[variant]}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
      {trend && (
        <div
          className={`flex items-center gap-1 mt-3 text-xs font-500 ${
            trend.direction === 'up'
              ? 'text-positive'
              : trend.direction === 'down'
                ? 'text-negative'
                : 'text-muted-foreground'
          }`}
        >
          {trend.direction === 'up' ? (
            <TrendingUp size={13} />
          ) : trend.direction === 'down' ? (
            <TrendingDown size={13} />
          ) : null}
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}

export default function KPIBentoGrid() {
  // 5 cards → grid-cols-4 → row 1: hero spans 2 cols + 2 regular, row 2: 3 cards (last spans 2 to fill)
  // Actually: 5 cards → 3+2 layout: row 1 = 3 cols (hero spans 2 + 1 regular), row 2 = 2 cards each span 1
  // Using: grid-cols-4, row1: hero(col-span-2) + 2 regular, row2: 1 card spans 2 + 1 card spans 2
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-8">
      {/* Hero card — Active Listings, spans 2 cols */}
      <KPICard
        id="kpi-listings"
        icon={Package}
        label="Active Listings"
        value={4}
        subtext="2 with open swap requests"
        trend={{ direction: 'up', label: '+1 listed this week' }}
        variant="default"
        className="lg:col-span-2"
      />
      {/* Pending Requests — alert state */}
      <KPICard
        id="kpi-pending"
        icon={ArrowLeftRight}
        label="Pending Requests"
        value={3}
        subtext="Oldest request: 2 days ago"
        variant="alert"
      />
      {/* Completed Swaps */}
      <KPICard
        id="kpi-completed"
        icon={CheckCircle}
        label="Completed Swaps"
        value={9}
        subtext="All time — 3 this month"
        trend={{ direction: 'up', label: '+3 vs last month' }}
        variant="positive"
      />
      {/* Swap Value Balance */}
      <KPICard
        id="kpi-value"
        icon={DollarSign}
        label="Value Balance"
        value="₹+6,800"
        subtext="Given ₹66,800 · Received ₹73,600"
        trend={{ direction: 'up', label: 'Net positive this month' }}
        variant="default"
        className="lg:col-span-2"
      />
      {/* Sustainability impact */}
      <KPICard
        id="kpi-sustainability"
        icon={Leaf}
        label="Items Saved"
        value={14}
        subtext="Pieces kept out of landfill"
        trend={{ direction: 'up', label: '≈ 42 kg CO₂ avoided' }}
        variant="accent"
        className="lg:col-span-2"
      />
    </div>
  );
}
