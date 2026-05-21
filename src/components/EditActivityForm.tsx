import { FormEvent, useState } from 'react';
import { updateActivity } from '../api/client';
import type { Activity, CategoryLimit } from '../types';

interface EditActivityFormProps {
  activity: Activity;
  limits: CategoryLimit[];
  onSaved: (next: Activity) => void;
  onCancel: () => void;
}

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditActivityForm({ activity, limits, onSaved, onCancel }: EditActivityFormProps) {
  const [categoryId, setCategoryId] = useState(activity.categoryId);
  const [amount, setAmount] = useState(String(activity.amount));
  const [description, setDescription] = useState(activity.description);
  const [occurredAt, setOccurredAt] = useState(toLocalInputValue(activity.occurredAt));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const amt = Number(amount);
    if (!description.trim() || !Number.isFinite(amt) || amt <= 0 || !categoryId) {
      setError('Provide a category, a positive amount, and a description.');
      return;
    }
    setSubmitting(true);
    try {
      const updated = await updateActivity(activity.id, {
        categoryId,
        amount: amt,
        description: description.trim(),
        occurredAt: new Date(occurredAt).toISOString()
      });
      onSaved(updated);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Failed to update activity');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="edit-cat" className="label">Category</label>
        <select
          id="edit-cat"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="input"
        >
          {limits.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="edit-act-amount" className="label">Amount (₦)</label>
        <input
          id="edit-act-amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="edit-act-desc" className="label">Description</label>
        <input
          id="edit-act-desc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="edit-act-when" className="label">When</label>
        <input
          id="edit-act-when"
          type="datetime-local"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          className="input"
        />
      </div>
      {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-ink hover:bg-chip"
        >
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn-dark px-4 py-1.5 text-xs">
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
