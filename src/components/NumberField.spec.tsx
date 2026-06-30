import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from './NumberField';

function Harness({ initial = 0, onChange }: { initial?: number; onChange?: (n: number) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <NumberField
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      aria-label="num"
    />
  );
}

describe('NumberField', () => {
  it('replaces a stuck leading zero instead of keeping it', async () => {
    const user = userEvent.setup();
    render(<Harness initial={0} />);
    const input = screen.getByLabelText('num') as HTMLInputElement;
    await user.type(input, '5');
    expect(input.value).toBe('5');
  });

  it('lets you clear and type a new value', async () => {
    const user = userEvent.setup();
    render(<Harness initial={5000} />);
    const input = screen.getByLabelText('num') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '250');
    expect(input.value).toBe('250');
  });

  it('emits parsed numbers to onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness initial={0} onChange={onChange} />);
    const input = screen.getByLabelText('num');
    await user.type(input, '12');
    expect(onChange).toHaveBeenLastCalledWith(12);
  });

  it('accepts decimals', async () => {
    const user = userEvent.setup();
    render(<Harness initial={0} />);
    const input = screen.getByLabelText('num') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '12.5');
    expect(input.value).toBe('12.5');
  });
});
