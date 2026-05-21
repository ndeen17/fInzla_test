import { useState } from 'react';
import type { Activity, CategoryLimit } from '../types';
import { Modal } from './Modal';
import { ConfirmDialog } from './ConfirmDialog';
import { EditActivityForm } from './EditActivityForm';
import { deleteActivity } from '../api/client';

function formatNaira(n: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' });
}

interface Props {
  activities: Activity[];
  limits: CategoryLimit[];
  onChanged: () => void;
}

type ModalState =
  | { kind: 'edit'; item: Activity }
  | { kind: 'delete'; item: Activity }
  | null;

export function ActivityList({ activities, limits, onChanged }: Props) {
  const nameById = new Map(limits.map((l) => [l.id, l.name]));
  const [modal, setModal] = useState<ModalState>(null);
  const close = () => setModal(null);

  if (activities.length === 0) {
    return <p className="text-sm text-muted">No activities recorded.</p>;
  }

  return (
    <>
      {/* Mobile: card list */}
      <ul className="space-y-2 sm:hidden">
        {activities.map((a) => (
          <li key={a.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{a.description}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {nameById.get(a.categoryId) ?? '—'}
                  <span className="mx-1.5 text-hairline">•</span>
                  <span className="font-mono">{formatDate(a.occurredAt)}</span>
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-ink">{formatNaira(a.amount)}</p>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                aria-label={`Edit activity ${a.description}`}
                onClick={() => setModal({ kind: 'edit', item: a })}
                className="rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-ink hover:bg-chip"
              >
                Edit
              </button>
              <button
                type="button"
                aria-label={`Delete activity ${a.description}`}
                onClick={() => setModal({ kind: 'delete', item: a })}
                className="rounded-pill border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* sm+ : table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-hairline bg-white shadow-card sm:block">
        <table className="w-full text-sm">
          <thead className="bg-chip/60 text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Category</th>
              <th className="px-3 py-2 text-left font-medium">Description</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {activities.map((a) => (
              <tr key={a.id}>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-muted">{formatDate(a.occurredAt)}</td>
                <td className="px-3 py-2 text-ink">{nameById.get(a.categoryId) ?? '—'}</td>
                <td className="px-3 py-2 text-ink">{a.description}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-ink">{formatNaira(a.amount)}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Edit activity ${a.description}`}
                      onClick={() => setModal({ kind: 'edit', item: a })}
                      className="rounded-pill border border-hairline px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-chip"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete activity ${a.description}`}
                      onClick={() => setModal({ kind: 'delete', item: a })}
                      className="rounded-pill border border-rose-200 px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modal?.kind === 'edit'}
        onClose={close}
        title="Edit activity"
      >
        {modal?.kind === 'edit' && (
          <EditActivityForm
            activity={modal.item}
            limits={limits}
            onSaved={() => { close(); onChanged(); }}
            onCancel={close}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={modal?.kind === 'delete'}
        title="Delete activity?"
        message={
          modal?.kind === 'delete'
            ? `Remove "${modal.item.description}" (${formatNaira(modal.item.amount)})? This cannot be undone.`
            : ''
        }
        onCancel={close}
        onConfirm={async () => {
          if (modal?.kind !== 'delete') return;
          await deleteActivity(modal.item.id);
          close();
          onChanged();
        }}
      />
    </>
  );
}
