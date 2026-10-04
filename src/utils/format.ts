import { CURRENCY_SYMBOLS } from '@/constants';

export function formatCurrency(amount: number, currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function monthLabel(month: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return names[month - 1] ?? '';
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}
