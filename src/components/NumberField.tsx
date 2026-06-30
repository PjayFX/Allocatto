import { useEffect, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

type NumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type'
> & {
  value: number;
  onChange: (value: number) => void;
};

/**
 * Numeric input that keeps a string buffer so editing feels natural: you can
 * clear it, and a leading zero is replaced instead of getting stuck (the usual
 * controlled `<input type="number">` pitfall). Emits a parsed number.
 */
export function NumberField({ value, onChange, onBlur, ...rest }: NumberFieldProps) {
  const [text, setText] = useState(() => String(value));

  // Re-sync when the value is changed from outside (e.g. switching amount/%).
  useEffect(() => {
    if (Number(text) !== value) setText(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(event) => {
        let next = event.target.value;
        if (next !== '' && !/^\d*\.?\d*$/.test(next)) return;
        next = next.replace(/^0+(?=\d)/, ''); // drop a stuck leading zero ("05" -> "5")
        setText(next);
        const parsed = Number(next);
        onChange(Number.isFinite(parsed) ? parsed : 0);
      }}
      onBlur={(event) => {
        setText(String(value));
        onBlur?.(event);
      }}
      {...rest}
    />
  );
}
