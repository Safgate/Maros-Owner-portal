import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingCart,
  Receipt,
  XCircle,
  Calendar,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';
import {
  salesStats,
  topItems,
  paymentBreakdown,
  typeBreakdown,
  byDaySeries,
} from '@/lib/analytics';
import { formatMAD, getRangeBounds } from '@/lib/format';
import { exportSalesReportPdf } from '@/lib/pdf';
import type { SalesReportData } from '@/lib/pdf';
import { toast } from 'sonner';

type Period = 'today' | 'week' | 'month';

const COLORS = ['#D4A574', '#3498db', '#2ecc71', '#F5F5F0'];

const easingExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easingExpo },
  }),
};

function useOwnerData(period: Period) {
  const orders = useStore((s) => s.orders);
  const settings = useStore((s) => s.settings);

  return useMemo(() => {
    const { start, end, label } = getRangeBounds(period, { start: '', end: '' });
    const stats = salesStats(orders, start, end);
    const top = topItems(orders, start, end, 5);
    const payments = paymentBreakdown(orders, start, end);
    const types = typeBreakdown(orders, start, end);
    const days = byDaySeries(orders, start, end);
    const totalForCancel = stats.totalCount + stats.cancelledCount;

    const reportData: SalesReportData = {
      periodLabel: label,
      revenue: stats.revenue,
      orderCount: stats.paidCount,
      avgTicket: stats.avgTicket,
      cancelledCount: stats.cancelledCount,
      cancelledPct: totalForCancel > 0 ? (stats.cancelledCount / totalForCancel) * 100 : 0,
      taxCollected: stats.taxCollected,
      byDay: days,
      topItems: top.map((t) => ({
        name: t.name,
        qty: t.qty,
        revenue: t.revenue,
        percent: t.percent,
      })),
      byPayment: payments.map((p) => ({
        name: p.name,
        count: p.count,
        amount: p.amount,
        percent: p.percent,
      })),
      byType: types.map((t) => ({
        name: t.name,
        count: t.count,
        amount: t.amount,
      })),
      byEmployee: [],
    };

    return { label, stats, top, payments, types, days, reportData, settings };
  }, [orders, period, settings]);
}

function KpiCard({
  title,
  value,
  icon: Icon,
  color,
  delay,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div custom={delay} variants={cardVariants} initial="hidden" animate="visible">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-warm-cream/50">{title}</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
              <Icon size={18} style={{ color }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-warm-cream font-display">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function OwnerPortal() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('today');
  const { label, stats, top, payments, types, days, reportData, settings } = useOwnerData(period);

  const handleExportPDF = () => {
    try {
      exportSalesReportPdf(reportData, settings);
      toast.success('PDF report downloaded');
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: t('today') },
    { key: 'week', label: t('thisWeek') },
    { key: 'month', label: t('thisMonth') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-navy to-navy-deep">
      {/* Header */}
      <div className="border-b border-navy-light bg-navy-mid/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-warm-cream font-display">{t('ownerPortal')}</h1>
              <p className="text-xs text-warm-cream/40">{settings.restaurantName}</p>
            </div>
          </div>
          <Button
            onClick={handleExportPDF}
            className="bg-moroccan-gold text-dark-navy hover:bg-gold-dark font-semibold rounded-xl gap-2"
          >
            <Download size={16} />
            <span className="hidden sm:inline">{t('exportPDF')}</span>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Period selector */}
        <div className="flex items-center justify-between">
          <div className="flex bg-navy-mid rounded-lg p-1 gap-1">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  period === p.key
                    ? 'bg-moroccan-gold text-dark-navy shadow-sm'
                    : 'text-warm-cream/50 hover:text-warm-cream'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-warm-cream/40">
            <Calendar size={14} />
            {label}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title={t('revenue')} value={formatMAD(stats.revenue)} icon={TrendingUp} color="#D4A574" delay={0} />
          <KpiCard title={t('orders')} value={String(stats.paidCount)} icon={ShoppingCart} color="#3498db" delay={1} />
          <KpiCard
            title={t('avgTicket')}
            value={stats.avgTicket > 0 ? formatMAD(stats.avgTicket) : '—'}
            icon={Receipt}
            color="#2ecc71"
            delay={2}
          />
          <KpiCard title={t('cancelled')} value={String(stats.cancelledCount)} icon={XCircle} color="#e74c3c" delay={3} />
        </div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: easingExpo }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-warm-cream flex items-center gap-2">
                <BarChart3 size={18} className="text-moroccan-gold" />
                {t('revenueTrend')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={days}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A574" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D4A574" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" tick={{ fill: 'rgba(245,245,240,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: 'rgba(245,245,240,0.4)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v} MAD`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#16213e',
                        border: '1px solid #2a3a5c',
                        borderRadius: 8,
                        color: '#e8d5b7',
                      }}
                      formatter={(value: number) => [formatMAD(value), 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#D4A574" strokeWidth={2} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom row: Top Items + Payment Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Top Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: easingExpo }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-warm-cream flex items-center gap-2">
                  <TrendingUp size={18} className="text-moroccan-gold" />
                  {t('topItems')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {top.length === 0 && (
                    <p className="text-sm text-warm-cream/30 text-center py-6">{t('noData')}</p>
                  )}
                  {top.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-navy-mid text-xs flex items-center justify-center text-warm-cream/50 font-medium">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-warm-cream truncate">{item.name}</p>
                        <div className="h-1.5 bg-navy-mid rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-moroccan-gold rounded-full"
                            style={{ width: `${Math.min(100, item.percent)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-warm-cream font-medium">{formatMAD(item.revenue)}</p>
                        <p className="text-xs text-warm-cream/40">{item.qty} sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: easingExpo }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-warm-cream flex items-center gap-2">
                  <PieChartIcon size={18} className="text-moroccan-gold" />
                  {t('paymentMethods')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-sm text-warm-cream/30 text-center py-6">{t('noData')}</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={payments}
                            dataKey="amount"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                          >
                            {payments.map((_, i) => (
                              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: '#16213e',
                              border: '1px solid #2a3a5c',
                              borderRadius: 8,
                              color: '#e8d5b7',
                            }}
                            formatter={(value: number) => [formatMAD(value), '']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center mt-2">
                      {payments.map((p, i) => (
                        <div key={p.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-warm-cream/60">{p.name}</span>
                          <span className="text-xs text-warm-cream font-medium">{p.percent.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Type Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: easingExpo }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-warm-cream flex items-center gap-2">
                <ShoppingCart size={18} className="text-moroccan-gold" />
                {t('orderTypes')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {types.map((tItem) => (
                  <div key={tItem.name} className="bg-navy-mid rounded-lg p-4 text-center">
                    <p className="text-xs text-warm-cream/40 mb-1">{tItem.name}</p>
                    <p className="text-xl font-bold text-warm-cream font-display">{formatMAD(tItem.amount)}</p>
                    <p className="text-xs text-warm-cream/40 mt-1">{tItem.count} orders</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
