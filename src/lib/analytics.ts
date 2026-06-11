import type { Category, MenuItem, Order } from '@/types/domain';
import { isWithin } from './format';

export interface SalesStats {
  revenue: number;
  paidCount: number;
  totalCount: number;
  cancelledCount: number;
  avgTicket: number;
  taxCollected: number;
}

export function salesStats(orders: Order[], start: Date, end: Date): SalesStats {
  const inRange = orders.filter((o) => isWithin(o.createdAt, start, end));
  const paid = inRange.filter((o) => o.paymentStatus === 'paid' && o.status !== 'cancelled');
  const cancelled = inRange.filter((o) => o.status === 'cancelled');
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  return {
    revenue,
    paidCount: paid.length,
    totalCount: inRange.length - cancelled.length,
    cancelledCount: cancelled.length,
    avgTicket: paid.length > 0 ? revenue / paid.length : 0,
    taxCollected: paid.reduce((s, o) => s + o.taxAmount, 0),
  };
}

export interface TopItem {
  name: string;
  qty: number;
  revenue: number;
  percent: number;
}

export function topItems(orders: Order[], start: Date, end: Date, limit = 10): TopItem[] {
  const map = new Map<string, { qty: number; revenue: number }>();
  let totalRevenue = 0;
  orders.forEach((o) => {
    if (o.paymentStatus !== 'paid' || o.status === 'cancelled' || !isWithin(o.createdAt, start, end)) return;
    o.items.forEach((it) => {
      const cur = map.get(it.name) ?? { qty: 0, revenue: 0 };
      cur.qty += it.quantity;
      cur.revenue += it.price * it.quantity;
      map.set(it.name, cur);
      totalRevenue += it.price * it.quantity;
    });
  });
  return [...map.entries()]
    .map(([name, v]) => ({
      name,
      qty: v.qty,
      revenue: Math.round(v.revenue * 100) / 100,
      percent: totalRevenue > 0 ? (v.revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function paymentBreakdown(
  orders: Order[],
  start: Date,
  end: Date
): { name: string; count: number; amount: number; percent: number }[] {
  const map = new Map<string, { count: number; amount: number }>();
  let total = 0;
  orders.forEach((o) => {
    if (o.paymentStatus !== 'paid' || o.status === 'cancelled' || !isWithin(o.createdAt, start, end)) return;
    const key = o.paymentMethod || 'Autre';
    const cur = map.get(key) ?? { count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += o.total;
    map.set(key, cur);
    total += o.total;
  });
  return [...map.entries()]
    .map(([name, v]) => ({
      name,
      count: v.count,
      amount: Math.round(v.amount * 100) / 100,
      percent: total > 0 ? (v.amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function typeBreakdown(
  orders: Order[],
  start: Date,
  end: Date
): { name: string; count: number; amount: number }[] {
  const labels: Record<string, string> = { sur_place: 'Sur place', emporter: 'Emporter', livraison: 'Livraison' };
  const map = new Map<string, { count: number; amount: number }>();
  orders.forEach((o) => {
    if (o.paymentStatus !== 'paid' || o.status === 'cancelled' || !isWithin(o.createdAt, start, end)) return;
    const key = labels[o.type];
    const cur = map.get(key) ?? { count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += o.total;
    map.set(key, cur);
  });
  return Object.values(labels).map((name) => ({
    name,
    count: map.get(name)?.count ?? 0,
    amount: Math.round((map.get(name)?.amount ?? 0) * 100) / 100,
  }));
}

export function byDaySeries(
  orders: Order[],
  start: Date,
  end: Date
): { label: string; date: string; revenue: number; orders: number }[] {
  const days: { label: string; date: string; revenue: number; orders: number }[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(end);
  while (cursor <= last && days.length < 92) {
    days.push({
      label: cursor.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      date: cursor.toDateString(),
      revenue: 0,
      orders: 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  orders.forEach((o) => {
    if (o.paymentStatus !== 'paid' || o.status === 'cancelled') return;
    const d = new Date(o.createdAt).toDateString();
    const day = days.find((x) => x.date === d);
    if (day) {
      day.revenue += o.total;
      day.orders += 1;
    }
  });
  return days.map((d) => ({ ...d, revenue: Math.round(d.revenue * 100) / 100 }));
}
