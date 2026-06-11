export function formatMAD(amount: number): string {
  return (
    amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' MAD'
  );
}

export function newId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export type RangeKey = 'today' | 'yesterday' | 'week' | 'month' | 'all' | 'custom';

export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

export function getRangeBounds(
  range: RangeKey,
  custom?: { start: string; end: string }
): { start: Date; end: Date; label: string } {
  const now = new Date();
  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now), label: "Aujourd'hui" };
    case 'yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return { start: startOfDay(y), end: endOfDay(y), label: 'Hier' };
    }
    case 'week': {
      const s = new Date(now);
      s.setDate(s.getDate() - 6);
      return { start: startOfDay(s), end: endOfDay(now), label: '7 derniers jours' };
    }
    case 'month': {
      const s = new Date(now);
      s.setDate(s.getDate() - 29);
      return { start: startOfDay(s), end: endOfDay(now), label: '30 derniers jours' };
    }
    case 'all':
      return { start: new Date(0), end: endOfDay(now), label: 'Tout' };
    case 'custom': {
      const s = custom?.start ? startOfDay(new Date(custom.start)) : startOfDay(now);
      const e = custom?.end ? endOfDay(new Date(custom.end)) : endOfDay(now);
      return { start: s, end: e, label: 'Personnalisé' };
    }
  }
}

export function isWithin(iso: string, start: Date, end: Date): boolean {
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
}
