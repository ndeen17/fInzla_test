import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '../components/StatusBadge';

describe('StatusBadge', () => {
  it.each(['On Track', 'Warning', 'Exceeded'] as const)('renders %s label', (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByTestId('status-badge')).toHaveTextContent(status);
  });

  it('applies the rose ring class for Exceeded', () => {
    render(<StatusBadge status="Exceeded" />);
    expect(screen.getByTestId('status-badge').className).toMatch(/rose/);
  });
});
