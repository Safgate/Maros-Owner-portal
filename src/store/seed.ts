import type { Order, AppSettings, Category, MenuItem } from '@/types/domain';
import { newId } from '@/lib/format';

export const SEED_SETTINGS: AppSettings = {
  restaurantName: 'Le Marrakech',
  address: '123 Boulevard Mohammed V',
  city: 'Casablanca',
  phone: '+212 522-123456',
  email: 'contact@lemarrakech.ma',
  taxRate: 10,
  taxNumber: 'MA123456789',
  showTaxNumber: true,
  showLogo: true,
  receiptHeader: '',
  receiptFooter: 'Merci de votre visite ! À bientôt',
  receiptWidth: '80',
  qrBaseUrl: 'https://maros.app/order',
  autoLockMinutes: null,
  language: 'fr',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24',
};

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-entrees', name: 'Entrées', icon: 'Soup', color: '#e74c3c', sortOrder: 1 },
  { id: 'cat-plats', name: 'Plats Principaux', icon: 'ChefHat', color: '#D4A574', sortOrder: 2 },
  { id: 'cat-desserts', name: 'Desserts', icon: 'Cake', color: '#e91e63', sortOrder: 3 },
  { id: 'cat-boissons', name: 'Boissons', icon: 'GlassWater', color: '#3498db', sortOrder: 4 },
  { id: 'cat-cafe', name: 'Café & Thé', icon: 'Coffee', color: '#6D4C41', sortOrder: 5 },
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Couscous Royal', categoryId: 'cat-plats', price: 85, description: 'Semoule fine avec agneau, poulet, merguez et légumes', available: true },
  { id: 'm2', name: 'Tagine Poulet', categoryId: 'cat-plats', price: 70, description: 'Poulet aux olives et citrons confits', available: true },
  { id: 'm3', name: 'Harira', categoryId: 'cat-entrees', price: 25, description: 'Soupe traditionnelle marocaine aux tomates et lentilles', available: true },
  { id: 'm4', name: 'Pastilla', categoryId: 'cat-plats', price: 95, description: 'Feuilleté sucré-salé au poulet et amandes', available: true },
  { id: 'm5', name: 'Brochettes Mixte', categoryId: 'cat-plats', price: 60, description: 'Assortiment de viandes grillées', available: true },
  { id: 'm6', name: 'Tajine Kefta', categoryId: 'cat-plats', price: 65, description: 'Boulettes de viande sauce tomate et œufs', available: true },
  { id: 'm7', name: 'Salade Marocaine', categoryId: 'cat-entrees', price: 30, description: 'Tomates, oignons, poivrons à la marocaine', available: true },
  { id: 'm8', name: 'Zaalouk', categoryId: 'cat-entrees', price: 20, description: "Caviar d'aubergine fumée aux épices", available: true },
  { id: 'm9', name: 'Briouates', categoryId: 'cat-entrees', price: 35, description: 'Feuilletés farcis au poulet et amandes', available: true },
  { id: 'm10', name: 'Chorba', categoryId: 'cat-entrees', price: 22, description: "Soupe épicée à l'agneau et vermicelles", available: true },
  { id: 'm11', name: 'Cornes de Gazelle', categoryId: 'cat-desserts', price: 15, description: "Pâtisseries amandes et eau de fleur d'oranger", available: true },
  { id: 'm12', name: 'Msemen', categoryId: 'cat-desserts', price: 12, description: 'Crêpes feuilletées marocaines au miel', available: true },
  { id: 'm13', name: 'Chebakia', categoryId: 'cat-desserts', price: 18, description: 'Gâteaux en forme de rose, sésame et miel', available: true },
  { id: 'm14', name: 'Thé à la Menthe', categoryId: 'cat-cafe', price: 15, description: 'Thé vert à la menthe fraîche, sucré', available: true },
  { id: 'm15', name: 'Café Noir', categoryId: 'cat-cafe', price: 10, description: 'Café arabica fort, servi traditionnellement', available: true },
  { id: 'm16', name: 'Café au Lait', categoryId: 'cat-cafe', price: 12, description: 'Café allongé au lait chaud', available: true },
  { id: 'm17', name: "Jus d'Orange", categoryId: 'cat-boissons', price: 20, description: "Jus d'orange fraîchement pressé", available: true },
  { id: 'm18', name: 'Smoothie Avocat', categoryId: 'cat-boissons', price: 25, description: "Smoothie crémeux à l'avocat et fruits secs", available: true },
  { id: 'm19', name: 'Jus de Carotte', categoryId: 'cat-boissons', price: 18, description: 'Jus de carotte frais au gingembre', available: true },
  { id: 'm20', name: 'Eau Minérale', categoryId: 'cat-boissons', price: 8, description: 'Eau minérale naturelle', available: true },
];

const MENU_ITEM_MAP = new Map(SEED_MENU_ITEMS.map((m) => [m.id, m]));

const STAFF_NAMES = ['Youssef Alami', 'Fatima Zahra', 'Karim Benali', 'Sofia Benomar', 'Omar Fassi', 'Leila Mahmoud'];

function randomItem(): { menuItemId: string; name: string; price: number; quantity: number } {
  const items = SEED_MENU_ITEMS.filter((m) => m.available);
  const item = items[Math.floor(Math.random() * items.length)];
  return {
    menuItemId: item.id,
    name: item.name,
    price: item.price,
    quantity: Math.floor(Math.random() * 3) + 1,
  };
}

export function generateDemoOrders(count = 200): Order[] {
  const orders: Order[] = [];
  const now = new Date();
  const types: Array<'sur_place' | 'emporter' | 'livraison'> = ['sur_place', 'sur_place', 'sur_place', 'emporter', 'livraison'];
  const paymentMethods: Array<'Espèces' | 'Carte Bancaire' | 'Virement'> = ['Espèces', 'Espèces', 'Carte Bancaire', 'Carte Bancaire', 'Virement'];

  for (let i = 0; i < count; i++) {
    const dayOffset = Math.floor(Math.random() * 30);
    const hour = 9 + Math.floor(Math.random() * 13);
    const minute = Math.floor(Math.random() * 60);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - dayOffset);
    createdAt.setHours(hour, minute, 0, 0);

    const numItems = Math.floor(Math.random() * 4) + 1;
    const items = Array.from({ length: numItems }, randomItem);
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const taxRate = SEED_SETTINGS.taxRate;
    const taxAmount = Math.round(subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const isPaid = Math.random() > 0.15;
    const isCancelled = !isPaid && Math.random() > 0.7;

    const type = types[Math.floor(Math.random() * types.length)];
    const staff = STAFF_NAMES[Math.floor(Math.random() * STAFF_NAMES.length)];

    orders.push({
      id: newId(),
      number: `CMD-${String(count - i).padStart(4, '0')}`,
      type,
      tableId: type === 'sur_place' ? `T${Math.floor(Math.random() * 20) + 1}` : null,
      tableName: type === 'sur_place' ? `Table ${Math.floor(Math.random() * 20) + 1}` : null,
      items: items.map((it) => ({ ...it, id: newId(), notes: '' })),
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: isCancelled ? 'cancelled' : isPaid ? 'served' : 'pending',
      paymentStatus: isCancelled ? 'unpaid' : isPaid ? 'paid' : 'unpaid',
      paymentMethod: isPaid ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
      amountReceived: isPaid ? total : undefined,
      changeGiven: undefined,
      customerName: `Client ${Math.floor(Math.random() * 100) + 1}`,
      createdAt: createdAt.toISOString(),
      paidAt: isPaid ? createdAt.toISOString() : undefined,
      createdById: 'staff-' + staff,
      createdByName: staff,
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
