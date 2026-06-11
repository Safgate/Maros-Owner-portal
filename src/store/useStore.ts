import { create } from 'zustand';
import type { Order, AppSettings } from '@/types/domain';
import { SEED_SETTINGS, generateDemoOrders } from './seed';

interface StoreState {
  orders: Order[];
  settings: AppSettings;
}

export const useStore = create<StoreState>(() => ({
  orders: generateDemoOrders(250),
  settings: SEED_SETTINGS,
}));
