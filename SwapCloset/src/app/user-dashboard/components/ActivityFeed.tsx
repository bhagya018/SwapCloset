import React from 'react';
import { ArrowLeftRight, Eye, MessageSquare, Heart, CheckCircle, Clock } from 'lucide-react';
import { ACTIVITY_FEED } from './dashboardData';

const ICON_MAP: Record<string, React.ElementType> = {
  ArrowLeftRight,
  Eye,
  MessageSquare,
  Heart,
  CheckCircle,
};

const TYPE_COLORS: Record<string, string> = {
  swap_request: 'bg-warning/10 text-warning',
  listing_view: 'bg-info/10 text-info',
  swap_completed: 'bg-positive/10 text-positive',
  message: 'bg-primary/10 text-primary',
  listing_saved: 'bg-accent/10 text-accent',
};

export default function ActivityFeed() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-600 text-foreground">Recent Activity</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          Last 7 days
        </span>
      </div>

      <div className="space-y-3">
        {ACTIVITY_FEED.map((item) => {
          const Icon = ICON_MAP[item.icon] || ArrowLeftRight;
          const colorClass = TYPE_COLORS[item.type] || 'bg-muted text-muted-foreground';
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}
              >
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{item.description}</p>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <Clock size={11} />
                  <span className="text-[11px]">{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2.5 rounded-xl border border-border text-xs font-500 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        View all activity
      </button>
    </div>
  );
}
