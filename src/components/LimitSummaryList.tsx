import { useState } from 'react';
import type { CategoryLimit, LimitSummary } from '../types';
import { StatusBadge } from './StatusBadge';
import { Modal } from './Modal';
import { ConfirmDialog } from './ConfirmDialog';
import { EditLimitForm } from './EditLimitForm';
import { deleteLimit } from '../api/client';

function formatNaira(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

function barColor(status: LimitSummary['status']): string {
  if (status === 'Exceeded') return 'bg-rose-500';
  if (status === 'Warning') return 'bg-amber-500';
  return 'bg-emerald-500';
}

interface Props {
  items: LimitSummary[];
  loading: boolean;
  limits: CategoryLimit[];
  onChanged: () => void;
}

type ModalState =
  | { kind: 'edit'; item: LimitSummary }
  | { kind: 'delete'; item: LimitSummary }
  | null;

export function LimitSummaryList({ items, loading, onChanged }: Props) {
  const [modal, setModal] = useState<ModalState>(null);

  if (loading) return <p className="text-sm text-muted">Loading summary…</p>;
  if (items.length === 0) return <p className="text-sm text-muted">No category limits yet.</p>;

  const close = () => setModal(null);

  return (
    <>
      <div className="space-y-3">
        {items.map((s) => {
          const width = Math.min(100, s.percentage);
          return (
            <div key={s.categoryId} className="card animate-fade-up">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-ink">{s.name}</h3>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {formatNaira(s.usage)} of {formatNaira(s.limitAmount)}
                    <span className="ml-1.5 font-mono text-[11px] text-muted">({s.percentage.toFixed(1)}%)</span>
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${s.name}`}
                    onClick={() => setModal({ kind: 'edit', item: s })}
                    className="rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-ink hover:bg-chip"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${s.name}`}
                    onClick={() => setModal({ kind: 'delete', item: s })}
                    className="rounded-pill border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-chip">
                <div className={`h-full ${barColor(s.status)}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={modal?.kind === 'edit'}
        onClose={close}
        title={modal?.kind === 'edit' ? `Edit "${modal.item.name}"` : ''}
      >
        {modal?.kind === 'edit' && (
          <EditLimitForm
            limit={{ id: modal.item.categoryId, name: modal.item.name, limitAmount: modal.item.limitAmount }}
            onSaved={() => { close(); onChanged(); }}
            onCancel={close}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={modal?.kind === 'delete'}
        title={modal?.kind === 'delete' ? `Delete "${modal.item.name}"?` : ''}
        message={
          modal?.kind === 'delete'
            ? `This will also remove every activity logged under "${modal.item.name}". This cannot be undone.`
            : ''
        }
        onCancel={close}
        onConfirm={async () => {
          if (modal?.kind !== 'delete') return;
          await deleteLimit(modal.item.categoryId);
          close();
          onChanged();
        }}
      />
    </>
  );
}
