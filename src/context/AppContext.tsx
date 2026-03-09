import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Note, AppSettings, TabType } from '../types';

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUserRole: 'admin' | 'staff';
  setCurrentUserRole: (role: 'admin' | 'staff') => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setShopNameFromLogin: (username: string) => void;
  t: (key: string) => string;
}

const defaultSettings: AppSettings = {
  shopName: 'My Shop',
  language: 'en',
  currency: 'PKR',
  theme: {
    primaryColor: '#22c55e',
    accentColor: '#16a34a',
  },
  appLockPin: '',
  staffAccounts: [],
  autoReminders: false,
  darkMode: false,
};

const translations: Record<string, Record<string, string>> = {
  en: {
    appName: 'Digital Khata',
    customers: 'Customers',
    notebook: 'Notebook',
    reports: 'Reports',
    settings: 'Settings',
    addCustomer: 'Add Customer',
    customerName: 'Customer Name',
    phoneNumber: 'Phone Number',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search customers...',
    balance: 'Balance',
    lastEntry: 'Last Entry',
    addEntry: 'Add Entry',
    itemName: 'Item Name',
    quantity: 'Quantity',
    price: 'Price',
    cashPaid: 'Cash Paid',
    remaining: 'Remaining',
    purchaseDate: 'Purchase Date',
    dueDate: 'Due Date',
    addProduct: 'Add Product',
    sendReminder: 'Send Reminder',
    paid: 'Paid',
    unpaid: 'Unpaid',
    payAll: 'Pay All',
    shopName: 'Shop Name',
    language: 'Language',
    currency_label: 'Currency',
    developer: 'Developer',
    login: 'Login',
    password: 'Password',
    username: 'Username',
    logout: 'Logout',
    noEntries: 'No entries yet',
    noCustomers: 'No customers found',
    addNote: 'Add Note',
    noteTitle: 'Note Title',
    noteContent: 'Note Content',
    notes: 'Notes',
    totalAmount: 'Total Amount',
    products: 'Products',
    enterItemName: 'Enter item name',
    reminderMessage: 'Reminder: Your payment is overdue. Please clear your dues.',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    reportTitle: 'Business Report',
    totalCustomers: 'Total Customers',
    totalReceivables: 'Total Receivables',
    totalReceived: 'Total Received',
    overduePayments: 'Overdue Payments',
    customerSummary: 'Customer Summary',
    remainingBalance: 'Remaining Balance',
    total: 'Total',
    pending: 'Pending',
    overdue: 'Overdue',
    transactionHistory: 'Transaction History',
    calculation: 'Calculation',
    enterQtyPrice: 'Enter quantity and price',
    yourNotes: 'Your Notes',
    noNotes: 'No notes yet',
    tapToAddNote: 'Tap + to add a note',
    newNote: 'New Note',
    editNote: 'Edit Note',
    noteColor: 'Note Color',
    linkCustomer: 'Link to Customer',
    selectCustomer: 'Select customer...',
    writeAnything: 'Write anything you want...',
    note: 'Note',
    update: 'Update',
    deleteNote: 'Delete Note?',
    deleteConfirm: 'This action cannot be undone.',
    delete: 'Delete',
    entries: 'Entries',
    premiumFeatures: 'Premium Features',
    appLock: 'App Lock PIN',
    staffAccounts: 'Staff Accounts',
    autoReminders: 'Auto WhatsApp Reminders',
    addStaff: 'Add Staff Account',
    adminLogin: 'Login as Admin',
    staffLogin: 'Login as Staff',
    pinPlaceholder: 'Enter PIN Code',
    darkMode: 'Dark Mode',
  },
  ur: {
    appName: 'ڈیجیٹل کھاتہ',
    customers: 'گاہک',
    notebook: 'نوٹ بک',
    reports: 'رپورٹ',
    settings: 'ترتیبات',
    addCustomer: 'گاہک شامل کریں',
    customerName: 'گاہک کا نام',
    phoneNumber: 'فون نمبر',
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    search: 'گاہک تلاش کریں...',
    balance: 'بقایا',
    lastEntry: 'آخری اندراج',
    addEntry: 'اندراج شامل کریں',
    itemName: 'آئٹم کا نام',
    quantity: 'تعداد',
    price: 'قیمت',
    cashPaid: 'ادائیگی',
    remaining: 'بقایا',
    purchaseDate: 'خریداری کی تاریخ',
    dueDate: 'آخری تاریخ',
    addProduct: 'پروڈکٹ شامل کریں',
    sendReminder: 'ریمائنڈر بھیجیں',
    paid: 'ادائیگی شدہ',
    unpaid: 'غیر ادائیگی شدہ',
    payAll: 'سب ادائیگی کریں',
    shopName: 'دکان کا نام',
    language: 'زبان',
    currency_label: 'کرنسی',
    developer: 'ڈویلپر',
    login: 'لاگ ان',
    password: 'پاس ورڈ',
    username: 'صارف نام',
    logout: 'لاگ آؤٹ',
    noEntries: 'کوئی اندراج نہیں',
    noCustomers: 'کوئی گاہک نہیں ملا',
    addNote: 'نوٹ شامل کریں',
    noteTitle: 'نوٹ کا عنوان',
    noteContent: 'نوٹ کا مواد',
    notes: 'نوٹس',
    totalAmount: 'کل رقم',
    products: 'پروڈکٹس',
    enterItemName: 'آئٹم کا نام درج کریں',
    reminderMessage: 'یاد دہانی: آپ کی ادائیگی باقی ہے۔ براہ کرم اپنے بقایا کی ادائیگی کریں۔',
    whatsapp: 'واٹس ایپ',
    sms: 'ایس ایم ایس',
    reportTitle: 'کاروباری رپورٹ',
    totalCustomers: 'کل گاہک',
    totalReceivables: 'کل وصولی',
    totalReceived: 'کل موصول',
    overduePayments: 'تاخیر سے ادائیگی',
    customerSummary: 'گاہک کا خلاصہ',
    remainingBalance: 'بقایا رقم',
    total: 'کل',
    pending: 'زیر التوا',
    overdue: 'تاخیر',
    transactionHistory: 'لین دین کی تاریخ',
    calculation: 'حساب کتاب',
    enterQtyPrice: 'تعداد اور قیمت درج کریں',
    yourNotes: 'آپ کے نوٹس',
    noNotes: 'ابھی تک کوئی نوٹ نہیں',
    tapToAddNote: 'نوٹ شامل کرنے کے لیے + دبائیں',
    newNote: 'نیا نوٹ',
    editNote: 'نوٹ میں ترمیم کریں',
    noteColor: 'نوٹ کا رنگ',
    linkCustomer: 'گاہک سے جوڑیں',
    selectCustomer: 'گاہک منتخب کریں...',
    writeAnything: 'جو چاہیں لکھیں...',
    note: 'نوٹ',
    update: 'اپڈیٹ',
    deleteNote: 'نوٹ حذف کریں؟',
    deleteConfirm: 'یہ عمل کالعدم نہیں کیا جا سکتا۔',
    delete: 'حذف کریں',
    entries: 'اندراجات',
    premiumFeatures: 'پریمیم فیچرز',
    appLock: 'ایپ لاک پن',
    staffAccounts: 'اسٹاف اکاؤنٹس',
    autoReminders: 'آٹو واٹس ایپ ریمائنڈرز',
    addStaff: 'اسٹاف شامل کریں',
    adminLogin: 'ایڈمن لاگ ان',
    staffLogin: 'اسٹاف لاگ ان',
    pinPlaceholder: 'پن کوڈ درج کریں',
    darkMode: 'ڈارک موڈ',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'staff'>('admin');
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const setShopNameFromLogin = (username: string) => {
    setSettings(prev => ({ ...prev, shopName: username }));
  };

  useEffect(() => {
    const savedCustomers = localStorage.getItem('khata_customers');
    const savedNotes = localStorage.getItem('khata_notes');
    const savedSettings = localStorage.getItem('khata_settings');

    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('khata_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('khata_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('khata_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: `N${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (note: Note) => {
    setNotes(prev => prev.map(n => n.id === note.id ? note : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const t = (key: string): string => {
    return translations[settings.language]?.[key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      currentUserRole,
      setCurrentUserRole,
      activeTab,
      setActiveTab,
      selectedCustomer,
      setSelectedCustomer,
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      notes,
      addNote,
      updateNote,
      deleteNote,
      settings,
      updateSettings,
      setShopNameFromLogin,
      t,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
