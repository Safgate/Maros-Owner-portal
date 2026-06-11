export type Language = 'fr' | 'en' | 'ar';

export const translations = {
  fr: {
    revenue: 'Revenue',
    orders: 'Commandes',
    avgTicket: 'Ticket Moyen',
    cancelled: 'Annulées',
    revenueTrend: 'Tendance des Revenus',
    topItems: 'Articles Populaires',
    paymentMethods: 'Modes de Paiement',
    orderTypes: 'Types de Commande',
    exportPDF: 'Exporter PDF',
    today: "Aujourd'hui",
    thisWeek: 'Cette Semaine',
    thisMonth: 'Ce Mois',
    noData: 'Aucune donnée pour cette période',
    ownerPortal: 'Owner Portal',
  },
  en: {
    revenue: 'Revenue',
    orders: 'Orders',
    avgTicket: 'Avg Ticket',
    cancelled: 'Cancelled',
    revenueTrend: 'Revenue Trend',
    topItems: 'Top Items',
    paymentMethods: 'Payment Methods',
    orderTypes: 'Order Types',
    exportPDF: 'Export PDF',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    noData: 'No data for this period',
    ownerPortal: 'Owner Portal',
  },
  ar: {
    revenue: 'الإيرادات',
    orders: 'الطلبات',
    avgTicket: 'متوسط الفاتورة',
    cancelled: 'ملغاة',
    revenueTrend: 'اتجاه الإيرادات',
    topItems: 'العناصر الأكثر مبيعاً',
    paymentMethods: 'طرق الدفع',
    orderTypes: 'أنواع الطلبات',
    exportPDF: 'تصدير PDF',
    today: 'اليوم',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    noData: 'لا توجد بيانات لهذه الفترة',
    ownerPortal: 'بوابة المالك',
  },
} as const;

export function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}
