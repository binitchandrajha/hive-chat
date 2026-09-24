/** Default country for sign-in (the design targets Nepal). */
export const DEFAULT_COUNTRY = { flag: '🇳🇵', dialCode: '+977', length: 10 } as const;

/** Keep only digits, capped at `max`. */
export function digitsOnly(value: string, max: number = DEFAULT_COUNTRY.length): string {
  return value.replace(/\D/g, '').slice(0, max);
}

/** "9812345678" → "981 234 5678" (3-3-4 grouping, partial input allowed). */
export function formatPhone(value: string): string {
  const d = digitsOnly(value);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' ');
}
