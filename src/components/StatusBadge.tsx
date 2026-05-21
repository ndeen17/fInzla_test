import type { LimitStatus } from '../types';

const styles: Record<LimitStatus, string> = {
  'On Track': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Warning':  'bg-amber-50 text-amber-700 ring-amber-200',
  'Exceeded': 'bg-rose-50 text-rose-700 ring-rose-200'
};

export function StatusBadge({ status }: { status: LimitStatus }) {
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
