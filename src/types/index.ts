export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isPaid: boolean;
  paidAmount?: number;
}

export interface Entry {
  id: string;
  products: Product[];
  cashPaid: number;
  purchaseDate: string;
  dueDate: string;
  createdAt: string;
  totalAmount: number;
  remainingBalance: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  entries: Entry[];
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  customerId?: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  pin: string;
}

export type UserRole = 'admin' | 'staff';

export interface AppSettings {
  shopName: string;
  language: 'en' | 'ur';
  currency: string;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
  appLockPin: string;
  staffAccounts: StaffAccount[];
  autoReminders: boolean;
  darkMode: boolean;
}

export type TabType = 'customers' | 'notebook' | 'reports' | 'settings';
