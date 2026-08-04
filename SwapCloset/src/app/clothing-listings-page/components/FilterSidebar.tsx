'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { CATEGORIES, SIZES, CONDITIONS, DISTANCES } from './listingsData';

interface FilterState {
  categories: string[];
  sizes: string[];
  conditions: string[];
  distance: string;
  minValue: number;
  maxValue: number;
  gender: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClear: () => void;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-sm font-600 text-foreground">{title}</span>
        {open ? (
          <ChevronUp size={16} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground" />
        )}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ filters, onFiltersChange, onClear }: FilterSidebarProps) {
  const toggleMulti = (key: 'categories' | 'sizes' | 'conditions', val: string) => {
    const current = filters[key];
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    onFiltersChange({ ...filters, [key]: next });
  };

  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    filters.conditions.length +
    (filters.distance !== 'Any distance' ? 1 : 0) +
    (filters.gender !== 'All' ? 1 : 0);

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="bg-card rounded-2xl border border-border p-5 sticky top-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-700 text-foreground">Filters</h3>
          {activeCount > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-accent font-500 hover:underline"
            >
              <X size={12} />
              Clear all ({activeCount})
            </button>
          )}
        </div>

        {/* Category */}
        <FilterSection title="Category">
          <div className="space-y-1.5">
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <label
                key={`filter-cat-${cat}`}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() => toggleMulti('categories', cat)}
                  className="w-3.5 h-3.5 accent-primary rounded"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Size */}
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((size) => (
              <button
                key={`filter-size-${size}`}
                onClick={() => toggleMulti('sizes', size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-500 border transition-all duration-150 ${
                  filters.sizes.includes(size)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Condition */}
        <FilterSection title="Condition">
          <div className="space-y-1.5">
            {CONDITIONS.map((cond) => (
              <label
                key={`filter-cond-${cond}`}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(cond)}
                  onChange={() => toggleMulti('conditions', cond)}
                  className="w-3.5 h-3.5 accent-primary rounded"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {cond}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Distance */}
        <FilterSection title="Distance">
          <div className="space-y-1.5">
            {DISTANCES.map((d) => (
              <label
                key={`filter-dist-${d}`}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="distance"
                  checked={filters.distance === d}
                  onChange={() => onFiltersChange({ ...filters, distance: d })}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {d}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Gender */}
        <FilterSection title="Gender">
          <div className="flex gap-2 flex-wrap">
            {['All', 'Women', 'Men', 'Unisex'].map((g) => (
              <button
                key={`filter-gender-${g}`}
                onClick={() => onFiltersChange({ ...filters, gender: g })}
                className={`px-3 py-1 rounded-full text-xs font-500 border transition-all duration-150 ${
                  filters.gender === g
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Swap value range */}
        <div>
          <p className="text-sm font-600 text-foreground mb-3">Swap Value Range</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[11px] text-muted-foreground mb-1 block">Min ($)</label>
              <input
                type="number"
                value={filters.minValue}
                onChange={(e) => onFiltersChange({ ...filters, minValue: Number(e.target.value) })}
                className="input-field text-sm py-2"
                min={0}
                max={filters.maxValue}
              />
            </div>
            <span className="text-muted-foreground mt-4">—</span>
            <div className="flex-1">
              <label className="text-[11px] text-muted-foreground mb-1 block">Max ($)</label>
              <input
                type="number"
                value={filters.maxValue}
                onChange={(e) => onFiltersChange({ ...filters, maxValue: Number(e.target.value) })}
                className="input-field text-sm py-2"
                min={filters.minValue}
                max={500}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
