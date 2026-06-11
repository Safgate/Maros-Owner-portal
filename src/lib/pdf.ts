import { jsPDF } from 'jspdf';
import type { AppSettings } from '@/types/domain';

const GOLD: [number, number, number] = [184, 138, 90];
const NAVY: [number, number, number] = [26, 26, 46];
const GRAY: [number, number, number] = [110, 110, 110];
const LIGHT_ROW: [number, number, number] = [245, 241, 233];

interface TableColumn {
  header: string;
  width: number;
  align?: 'left' | 'right' | 'center';
}

class PdfBuilder {
  doc: jsPDF;
  y: number;
  readonly marginX = 14;
  readonly pageWidth: number;
  readonly pageHeight: number;
  private settings: AppSettings;
  private title: string;
  private subtitle: string;

  constructor(settings: AppSettings, title: string, subtitle: string) {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4' });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.settings = settings;
    this.title = title;
    this.subtitle = subtitle;
    this.y = 0;
    this.drawHeader();
  }

  private drawHeader() {
    const { doc } = this;
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, this.pageWidth, 30, 'F');
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(this.settings.restaurantName || 'MAROS', this.marginX, 13);
    doc.setTextColor(235, 225, 205);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const addr = [this.settings.address, this.settings.city].filter(Boolean).join(', ');
    doc.text(addr, this.marginX, 19);
    doc.text(`Tél: ${this.settings.phone}  •  ${this.settings.email}`, this.marginX, 23.5);

    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(this.title, this.pageWidth - this.marginX, 13, { align: 'right' });
    doc.setTextColor(235, 225, 205);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(this.subtitle, this.pageWidth - this.marginX, 19, { align: 'right' });
    doc.setFontSize(8);
    doc.text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      this.pageWidth - this.marginX,
      23.5,
      { align: 'right' }
    );
    this.y = 38;
  }

  private drawFooter() {
    const { doc } = this;
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      doc.text(
        `${this.settings.restaurantName} — Rapport généré par MAROS`,
        this.marginX,
        this.pageHeight - 8
      );
      doc.text(`Page ${i}/${pageCount}`, this.pageWidth - this.marginX, this.pageHeight - 8, {
        align: 'right',
      });
    }
  }

  ensureSpace(needed: number) {
    if (this.y + needed > this.pageHeight - 16) {
      this.doc.addPage();
      this.y = 16;
    }
  }

  kpiRow(kpis: { label: string; value: string; hint?: string }[]) {
    const gap = 4;
    const w = (this.pageWidth - this.marginX * 2 - gap * (kpis.length - 1)) / kpis.length;
    const h = 20;
    this.ensureSpace(h + 6);
    kpis.forEach((kpi, i) => {
      const x = this.marginX + i * (w + gap);
      this.doc.setFillColor(...LIGHT_ROW);
      this.doc.roundedRect(x, this.y, w, h, 1.5, 1.5, 'F');
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...GRAY);
      this.doc.text(kpi.label.toUpperCase(), x + 4, this.y + 6);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(12);
      this.doc.setTextColor(...NAVY);
      this.doc.text(kpi.value, x + 4, this.y + 13);
      if (kpi.hint) {
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(6.5);
        this.doc.setTextColor(...GRAY);
        this.doc.text(kpi.hint, x + 4, this.y + 17.5);
      }
    });
    this.y += h + 8;
  }

  table(columns: TableColumn[], rows: (string | number)[][]) {
    const rowH = 7;
    const startX = this.marginX;

    const drawHead = () => {
      this.doc.setFillColor(...NAVY);
      this.doc.rect(startX, this.y, columns.reduce((s, c) => s + c.width, 0), rowH, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(235, 225, 205);
      let x = startX;
      columns.forEach((col) => {
        const tx = col.align === 'right' ? x + col.width - 2 : col.align === 'center' ? x + col.width / 2 : x + 2;
        this.doc.text(col.header, tx, this.y + 4.8, { align: col.align ?? 'left' });
        x += col.width;
      });
      this.y += rowH;
    };

    this.ensureSpace(rowH * 2);
    drawHead();

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    rows.forEach((row, ri) => {
      if (this.y + rowH > this.pageHeight - 16) {
        this.doc.addPage();
        this.y = 16;
        drawHead();
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
      }
      if (ri % 2 === 1) {
        this.doc.setFillColor(...LIGHT_ROW);
        this.doc.rect(startX, this.y, columns.reduce((s, c) => s + c.width, 0), rowH, 'F');
      }
      this.doc.setTextColor(50, 50, 50);
      let x = startX;
      row.forEach((cell, ci) => {
        const col = columns[ci];
        const text = String(cell);
        const clipped =
          this.doc.getTextWidth(text) > col.width - 4
            ? text.slice(0, Math.floor((col.width - 6) / 1.6)) + '…'
            : text;
        const tx = col.align === 'right' ? x + col.width - 2 : col.align === 'center' ? x + col.width / 2 : x + 2;
        this.doc.text(clipped, tx, this.y + 4.8, { align: col.align ?? 'left' });
        x += col.width;
      });
      this.y += rowH;
    });
    this.y += 6;
  }

  save(filename: string) {
    this.drawFooter();
    this.doc.save(filename);
  }
}

const fmtMoney = (n: number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD';

export interface SalesReportData {
  periodLabel: string;
  revenue: number;
  orderCount: number;
  avgTicket: number;
  cancelledCount: number;
  cancelledPct: number;
  taxCollected: number;
  byDay: { label: string; revenue: number; orders: number }[];
  topItems: { name: string; qty: number; revenue: number; percent: number }[];
  byPayment: { name: string; count: number; amount: number; percent: number }[];
  byType: { name: string; count: number; amount: number }[];
  byEmployee: { name: string; orders: number; sales: number }[];
}

export function exportSalesReportPdf(data: SalesReportData, settings: AppSettings) {
  const pdf = new PdfBuilder(settings, 'Rapport de Ventes', data.periodLabel);

  pdf.kpiRow([
    { label: "Chiffre d'affaires", value: fmtMoney(data.revenue), hint: 'commandes payées' },
    { label: 'Commandes payées', value: String(data.orderCount) },
    { label: 'Ticket moyen', value: data.orderCount ? fmtMoney(data.avgTicket) : '—' },
    { label: 'Annulations', value: String(data.cancelledCount), hint: `${data.cancelledPct.toFixed(1)}% du total` },
  ]);
  pdf.kpiRow([
    { label: 'TVA collectée', value: fmtMoney(data.taxCollected), hint: `taux actuel ${settings.taxRate}%` },
    { label: 'Sur place', value: fmtMoney(data.byType.find((t) => t.name === 'Sur place')?.amount ?? 0), hint: `${data.byType.find((t) => t.name === 'Sur place')?.count ?? 0} commandes` },
    { label: 'À emporter', value: fmtMoney(data.byType.find((t) => t.name === 'Emporter')?.amount ?? 0), hint: `${data.byType.find((t) => t.name === 'Emporter')?.count ?? 0} commandes` },
    { label: 'Livraison', value: fmtMoney(data.byType.find((t) => t.name === 'Livraison')?.amount ?? 0), hint: `${data.byType.find((t) => t.name === 'Livraison')?.count ?? 0} commandes` },
  ]);

  if (data.byDay.length > 1) {
    pdf.table(
      [
        { header: 'Jour', width: 60 },
        { header: 'Commandes', width: 40, align: 'center' },
        { header: 'Revenus', width: 50, align: 'right' },
      ],
      data.byDay.map((d) => [d.label, d.orders, fmtMoney(d.revenue)])
    );
  }

  pdf.table(
    [
      { header: '#', width: 10, align: 'center' },
      { header: 'Article', width: 70 },
      { header: 'Qté', width: 20, align: 'center' },
      { header: 'Revenus', width: 40, align: 'right' },
      { header: '% CA', width: 20, align: 'right' },
    ],
    data.topItems.map((t, i) => [i + 1, t.name, t.qty, fmtMoney(t.revenue), `${t.percent.toFixed(1)}%`])
  );

  pdf.table(
    [
      { header: 'Méthode', width: 60 },
      { header: 'Transactions', width: 35, align: 'center' },
      { header: 'Montant', width: 45, align: 'right' },
      { header: '%', width: 20, align: 'right' },
    ],
    data.byPayment.map((p) => [p.name, p.count, fmtMoney(p.amount), `${p.percent.toFixed(1)}%`])
  );

  if (data.byEmployee.length > 0) {
    pdf.table(
      [
        { header: 'Employé', width: 70 },
        { header: 'Commandes', width: 40, align: 'center' },
        { header: 'Ventes', width: 50, align: 'right' },
      ],
      data.byEmployee.map((e) => [e.name, e.orders, fmtMoney(e.sales)])
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  pdf.save(`rapport_ventes_${stamp}.pdf`);
}
