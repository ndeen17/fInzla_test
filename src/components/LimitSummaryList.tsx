import type { LimitSummary } from '../types';
import { StatusBadge } from './StatusBadge';

function formatNaira(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

function barColor(status: LimitSummary['status']): string {
  if (status === 'Exceeded') return 'bg-rose-500';
  if (status === 'Warning') return 'bg-amber-500';
  return 'bg-emerald-500';
}

export function LimitSummaryList({ items, loading }: { items: LimitSummary[]; loading: boolean }) {
  if (loading) return <p className="text-sm text-muted">Loading summary…</p>;
  if (items.length === 0) return <p className="text-sm text-muted">No category limits yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((s) => {
        const width = Math.min(100, s.percentage);
        return (
          <div key={s.categoryId} className="card animate-fade-up">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">{s.name}</h3>
                <p className="mt-0.5 text-xs text-muted">
                  {formatNaira(s.usage)} of {formatNaira(s.limitAmount)}
                  <span className="ml-1.5 font-mono text-[11px] text-muted">({s.percentage.toFixed(1)}%)</span>
                </p>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-chip">
              <div className={`h-full ${barColor(s.status)}`} style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
