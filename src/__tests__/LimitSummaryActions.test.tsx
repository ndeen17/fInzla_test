import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LimitSummaryList } from '../components/LimitSummaryList';
import * as client from '../api/client';
import type { LimitSummary, CategoryLimit } from '../types';

const items: LimitSummary[] = [
  {
    categoryId: 'cat-1',
    name: 'Food',
    limitAmount: 50000,
    period: 'monthly',
    usage: 10000,
    percentage: 20,
    status: 'On Track'
  }
];

const limits: CategoryLimit[] = [
  { id: 'cat-1', name: 'Food', limitAmount: 50000, period: 'monthly', createdAt: new Date().toISOString() }
];

describe('LimitSummaryList edit/delete', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('confirms before deleting and calls deleteLimit + onChanged', async () => {
    const deleteSpy = vi.spyOn(client, 'deleteLimit').mockResolvedValue();
    const onChanged = vi.fn();

    render(<LimitSummaryList items={items} loading={false} limits={limits} onChanged={onChanged} />);

    await userEvent.click(screen.getByRole('button', { name: /delete food/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/Delete "Food"\?/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/will also remove every activity/i)).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));

    expect(deleteSpy).toHaveBeenCalledWith('cat-1');
    expect(onChanged).toHaveBeenCalled();
  });

  it('opens edit modal with prefilled values and submits update', async () => {
    const updateSpy = vi.spyOn(client, 'updateLimit').mockResolvedValue({
      id: 'cat-1', name: 'Food', limitAmount: 75000, period: 'monthly', createdAt: new Date().toISOString()
    });
    const onChanged = vi.fn();

    render(<LimitSummaryList items={items} loading={false} limits={limits} onChanged={onChanged} />);

    await userEvent.click(screen.getByRole('button', { name: /edit food/i }));
    const dialog = await screen.findByRole('dialog');

    const amountInput = within(dialog).getByLabelText(/monthly limit/i) as HTMLInputElement;
    expect(amountInput.value).toBe('50000');

    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '75000');
    await userEvent.click(within(dialog).getByRole('button', { name: /save changes/i }));

    expect(updateSpy).toHaveBeenCalledWith('cat-1', { name: 'Food', limitAmount: 75000 });
    expect(onChanged).toHaveBeenCalled();
  });
});
