import React from 'react';

type BadgeVariant = 'active' | 'pending' | 'completed' | 'rejected' | 'draft' | 'negotiating';
type ConditionVariant = 'like-new' | 'good' | 'fair' | 'well-loved';

interface BadgeProps {
  variant?: BadgeVariant | ConditionVariant | string;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  active: 'status-active',
  pending: 'status-pending',
  completed: 'status-completed',
  rejected: 'status-rejected',
  draft: 'status-draft',
  negotiating: 'status-negotiating',
  'like-new': 'condition-like-new',
  good: 'condition-good',
  fair: 'condition-fair',
  'well-loved': 'condition-well-loved',
};

export default function Badge({ variant = 'draft', children, className = '' }: BadgeProps) {
  const cls = variantClasses[variant] || 'status-draft';
  return <span className={`status-badge ${cls} ${className}`}>{children}</span>;
}
