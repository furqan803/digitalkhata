import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';

export function CustomerList() {
  const { customers, setSelectedCustomer, setActiveTab, addCustomer, settings, updateSettings, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [showAutoReminderToast, setShowAutoReminderToast] = useState(false);

  useEffect(() => {
    if (settings.autoReminders) {
      const timer = setTimeout(() => setShowAutoReminderToast(true), 1500);
      const hideTimer = setTimeout(() => setShowAutoReminderToast(false), 5500);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [settings.autoReminders]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerBalance = (customer: Customer) => {
    return customer.entries.reduce((total, entry) => total + entry.remainingBalance, 0);
  };

  const getLastEntryDate = (customer: Customer) => {
    if (customer.entries.length === 0) return '-';
    const lastEntry = customer.entries[customer.entries.length - 1];
    return new Date(lastEntry.createdAt).toLocaleDateString();
  };

  const handleAddCustomer = () => {
    if (newCustomerName.trim()) {
      const newCustomer: Customer = {
        id: `C${String(customers.length + 1).padStart(4, '0')}`,
        name: newCustomerName.trim(),
        phone: newCustomerPhone.trim(),
        entries: [],
        createdAt: new Date().toISOString(),
      };
      addCustomer(newCustomer);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setShowAddModal(false);
    }
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveTab('customers');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">

      {/* Auto Reminder Toast */}
      {showAutoReminderToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-green-800 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center z-50 text-sm animate-bounce w-11/12 max-w-sm">
          <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold">Auto Reminders Sent!</p>
            <p className="text-xs text-green-200 mt-0.5">Notified overdue customers via WhatsApp.</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div
        className="px-4 py-4 shadow-sm"
        style={{ backgroundColor: settings.theme.primaryColor }}
      >
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-white mb-0">{settings.shopName}</h1>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            {settings.darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 bg-white/95 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>{t('noCustomers')}</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              className="flex items-center px-4 py-3 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3"
                style={{ backgroundColor: settings.theme.accentColor }}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 truncate">{customer.name}</h3>
                  <span className="text-xs text-gray-400 ml-2">{customer.id}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">{t('lastEntry')}: {getLastEntryDate(customer)}</span>
                  <span className={`text-sm font-semibold ${getCustomerBalance(customer) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {settings.currency} {getCustomerBalance(customer).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl font-bold z-10"
        style={{ backgroundColor: settings.theme.accentColor }}
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('addCustomer')}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('customerName')}</label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={settings.language === 'ur' ? 'گاہک کا نام' : 'Enter customer name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneNumber')}</label>
                <input
                  type="tel"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={settings.language === 'ur' ? 'فون نمبر' : 'Enter phone number'}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddCustomer}
                className="flex-1 py-2.5 text-white font-medium rounded-xl"
                style={{ backgroundColor: settings.theme.primaryColor }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
