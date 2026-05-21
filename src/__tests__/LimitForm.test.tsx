import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LimitForm } from '../components/LimitForm';
import * as client from '../api/client';

describe('LimitForm', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('submits a valid limit and calls onCreated', async () => {
    const createSpy = vi.spyOn(client, 'createLimit').mockResolvedValue({
      id: 'x', name: 'Books', limitAmount: 2000, period: 'monthly', createdAt: new Date().toISOString()
    });
    const onCreated = vi.fn();
    render(<LimitForm onCreated={onCreated} />);

    await userEvent.type(screen.getByLabelText(/category name/i), 'Books');
    await userEvent.type(screen.getByLabelText(/monthly limit/i), '2000');
    await userEvent.click(screen.getByRole('button', { name: /add limit/i }));

    expect(createSpy).toHaveBeenCalledWith({ name: 'Books', limitAmount: 2000 });
    expect(onCreated).toHaveBeenCalled();
  });

  it('shows a validation error for empty input', async () => {
    const createSpy = vi.spyOn(client, 'createLimit');
    render(<LimitForm onCreated={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /add limit/i }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });
});
