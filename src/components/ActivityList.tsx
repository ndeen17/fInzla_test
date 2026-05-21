import type { Activity, CategoryLimit } from '../types';

function formatNaira(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' });
}

export function ActivityList({ activities, limits }: { activities: Activity[]; limits: CategoryLimit[] }) {
  const nameById = new Map(limits.map((l) => [l.id, l.name]));

  if (activities.length === 0) {
    return <p className="text-sm text-muted">No activities recorded.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-chip/60 text-[11px] uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Date</th>
            <th className="px-3 py-2 text-left font-medium">Category</th>
            <th className="px-3 py-2 text-left font-medium">Description</th>
            <th className="px-3 py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {activities.map((a) => (
            <tr key={a.id}>
              <td className="px-3 py-2 font-mono text-xs text-muted">{formatDate(a.occurredAt)}</td>
              <td className="px-3 py-2 text-ink">{nameById.get(a.categoryId) ?? '—'}</td>
              <td className="px-3 py-2 text-ink">{a.description}</td>
              <td className="px-3 py-2 text-right font-medium text-ink">{formatNaira(a.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
