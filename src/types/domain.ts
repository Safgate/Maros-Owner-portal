export type StaffRole = 'Administrateur' | 'Manager' | 'Caissier' | 'Serveur' | 'Cuisine';
export type OrderType = 'sur_place' | 'emporter' | 'livraison';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type PaymentMethod = 'Espèces' | 'Carte Bancaire' | 'Virement';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface OrderLine {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  number: string;
  type: OrderType;
  tableId: string | null;
  tableName: string | null;
  items: OrderLine[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: PaymentMethod;
  amountReceived?: number;
  changeGiven?: number;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  deliveryStatus?: 'preparing' | 'out' | 'delivered';
  courierId?: string | null;
  courierName?: string | null;
  notes?: string;
  createdAt: string;
  paidAt?: string;
  createdById: string;
  createdByName: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  description?: string;
  available: boolean;
  imageUrl?: string;
  recipe?: { inventoryItemId: string; quantity: number }[];
}

export interface AppSettings {
  restaurantName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  taxRate: number;
  taxNumber: string;
  showTaxNumber: boolean;
  showLogo: boolean;
  receiptHeader: string;
  receiptFooter: string;
  receiptWidth: '58' | '80';
  qrBaseUrl: string;
  autoLockMinutes: number | null;
  language: 'fr' | 'en' | 'ar';
  dateFormat: string;
  timeFormat: '24' | '12';
}
