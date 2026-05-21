import { FormEvent, useState } from 'react';
import { updateLimit } from '../api/client';
import type { CategoryLimit } from '../types';

interface EditLimitFormProps {
  limit: { id: string; name: string; limitAmount: number };
  onSaved: (next: CategoryLimit) => void;
  onCancel: () => void;
}

export function EditLimitForm({ limit, onSaved, onCancel }: EditLimitFormProps) {
  const [name, setName] = useState(limit.name);
  const [limitAmount, setLimitAmount] = useState(String(limit.limitAmount));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const amount = Number(limitAmount);
    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError('Provide a name and a positive limit amount.');
      return;
    }
    setSubmitting(true);
    try {
      const updated = await updateLimit(limit.id, { name: name.trim(), limitAmount: amount });
      onSaved(updated);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Failed to update limit');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="edit-name" className="label">Category name</label>
        <input
          id="edit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="edit-amount" className="label">Monthly limit (₦)</label>
        <input
          id="edit-amount"
          type="number"
          min="1"
          step="0.01"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
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
