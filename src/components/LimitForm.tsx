import { useState, FormEvent } from 'react';
import { createLimit } from '../api/client';

export function LimitForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
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
      await createLimit({ name: name.trim(), limitAmount: amount });
      setName('');
      setLimitAmount('');
      onCreated();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? 'Failed to create limit';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-ink">Create category limit</h2>
        <p className="text-xs text-muted">Set a monthly cap for a spending category.</p>
      </div>
      <div className="space-y-1">
        <label htmlFor="name" className="label">Category name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Groceries"
          className="input"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="amount" className="label">Monthly limit (₦)</label>
        <input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          placeholder="50000"
          className="input"
        />
      </div>
      {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-dark w-full">
        {submitting ? 'Saving…' : 'Add limit'}
      </button>
    </form>
  );
}
