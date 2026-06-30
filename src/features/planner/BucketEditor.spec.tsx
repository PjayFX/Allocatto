import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BucketEditor } from './BucketEditor';
import { usePlanStore } from '../../store/planStore';

function resetStore() {
  usePlanStore.setState({
    salary: 15000,
    paidOn: '2026-06-15',
    config: {
      currency: 'PHP',
      buckets: [{ id: 'savings', name: 'Savings', rule: { kind: 'amount', amount: 5000 } }],
    },
  });
}

describe('BucketEditor', () => {
  beforeEach(() => resetStore());

  it('edits a bucket value (and the leading zero is replaceable)', async () => {
    const user = userEvent.setup();
    render(<BucketEditor />);
    const input = screen.getByLabelText('Savings value') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '250');
    expect(usePlanStore.getState().config.buckets[0]!.rule).toEqual({ kind: 'amount', amount: 250 });
  });

  it('switches a bucket between amount and percent', async () => {
    const user = userEvent.setup();
    render(<BucketEditor />);
    await user.click(screen.getByRole('button', { name: 'Percent' }));
    expect(usePlanStore.getState().config.buckets[0]!.rule.kind).toBe('percentage');
    await user.click(screen.getByRole('button', { name: 'Amount' }));
    expect(usePlanStore.getState().config.buckets[0]!.rule.kind).toBe('amount');
  });

  it('renames a bucket', async () => {
    const user = userEvent.setup();
    render(<BucketEditor />);
    const name = screen.getByLabelText('Bucket name') as HTMLInputElement;
    await user.clear(name);
    await user.type(name, 'Rent');
    expect(usePlanStore.getState().config.buckets[0]!.name).toBe('Rent');
  });

  it('adds and removes buckets', async () => {
    const user = userEvent.setup();
    render(<BucketEditor />);
    await user.click(screen.getByRole('button', { name: '+ Add category' }));
    expect(usePlanStore.getState().config.buckets).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Remove Savings' }));
    expect(usePlanStore.getState().config.buckets.some((b) => b.id === 'savings')).toBe(false);
  });
});
