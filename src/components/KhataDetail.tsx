import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Entry, Product } from '../types';

export function KhataDetail() {
  const { selectedCustomer, setSelectedCustomer, updateCustomer, settings, t } = useApp();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '', paidAmount: '' });
  const [cashPaid, setCashPaid] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  if (!selectedCustomer) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-400">{t('noCustomers')}</p>
      </div>
    );
  }

  // Parse quantity and price for calculations
  const quantity = newProduct.quantity === '' ? 1 : (parseInt(newProduct.quantity) || 1);
  const price = parseFloat(newProduct.price) || 0;
  const productPaidAmount = parseFloat(newProduct.paidAmount) || 0;
  const cashPaidAmount = parseFloat(cashPaid) || 0;

  // Real-time calculation for the new product being added
  const newProductTotal = quantity * price;
  const newProductRemaining = newProductTotal - productPaidAmount;

  const totalAmount = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const totalProductsPaid = products.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const remainingBalance = totalAmount - totalProductsPaid - cashPaidAmount;

  // Calculate customer totals
  const customerTotalAmount = selectedCustomer.entries.reduce((sum, entry) => {
    return sum + entry.products.reduce((pSum, p) => pSum + (p.quantity * p.price), 0);
  }, 0);

  const customerTotalRemaining = selectedCustomer.entries.reduce((sum, entry) => {
    return sum + entry.remainingBalance;
  }, 0);

  // Count statistics
  const totalEntries = selectedCustomer.entries.length;
  const paidEntries = selectedCustomer.entries.filter(e => e.remainingBalance <= 0).length;
  const pendingEntries = totalEntries - paidEntries;
  const overdueEntries = selectedCustomer.entries.filter(e => {
    if (!e.dueDate || e.remainingBalance <= 0) return false;
    return new Date(e.dueDate) < new Date();
  }).length;

  const addProductToList = () => {
    if (newProduct.name.trim() && price > 0 && quantity > 0) {
      const product: Product = {
        id: `P${Date.now()}`,
        name: newProduct.name.trim(),
        quantity: quantity,
        price: price,
        isPaid: newProductRemaining <= 0,
        paidAmount: productPaidAmount,
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', quantity: '', price: '', paidAmount: '' });
    }
  };

  const removeProductFromList = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const saveEntry = () => {
    if (products.length === 0) return;

    const entry: Entry = {
      id: `E${Date.now()}`,
      products: products,
      cashPaid: cashPaidAmount,
      purchaseDate: purchaseDate,
      dueDate: dueDate,
      createdAt: new Date().toISOString(),
      totalAmount: totalAmount,
      remainingBalance: remainingBalance,
    };

    const updatedCustomer = {
      ...selectedCustomer,
      entries: [...selectedCustomer.entries, entry],
    };

    updateCustomer(updatedCustomer);
    setSelectedCustomer(updatedCustomer);

    // Reset form
    setProducts([]);
    setNewProduct({ name: '', quantity: '', price: '', paidAmount: '' });
    setCashPaid('');
    setDueDate('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setShowEntryForm(false);
  };

  const toggleProductPaid = (entryId: string, productId: string) => {
    const updatedEntries = selectedCustomer.entries.map(entry => {
      if (entry.id === entryId) {
        const updatedProducts = entry.products.map(product => {
          if (product.id === productId) {
            return { ...product, isPaid: true };
          }
          return product;
        });
        const newRemainingBalance = updatedProducts
          .reduce((sum, p) => {
            const pTotal = p.quantity * p.price;
            const pPaid = p.paidAmount || 0;
            const pRem = p.isPaid ? 0 : Math.max(0, pTotal - pPaid);
            return sum + pRem;
          }, 0) - entry.cashPaid;
        return { ...entry, products: updatedProducts, remainingBalance: Math.max(0, newRemainingBalance) };
      }
      return entry;
    });

    const updatedCustomer = { ...selectedCustomer, entries: updatedEntries };
    updateCustomer(updatedCustomer);
    setSelectedCustomer(updatedCustomer);
  };

  const markAllPaid = (entryId: string) => {
    const updatedEntries = selectedCustomer.entries.map(entry => {
      if (entry.id === entryId) {
        const updatedProducts = entry.products.map(product => ({ ...product, isPaid: true }));
        return { ...entry, products: updatedProducts, remainingBalance: 0 };
      }
      return entry;
    });

    const updatedCustomer = { ...selectedCustomer, entries: updatedEntries };
    updateCustomer(updatedCustomer);
    setSelectedCustomer(updatedCustomer);
  };

  const isOverdue = (entry: Entry) => {
    if (!entry.dueDate || entry.remainingBalance <= 0) return false;
    return new Date(entry.dueDate) < new Date();
  };

  const getEntryTotal = (entry: Entry) => {
    return entry.products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  };

  const closeEntryForm = () => {
    setShowEntryForm(false);
    setProducts([]);
    setNewProduct({ name: '', quantity: '', price: '', paidAmount: '' });
    setCashPaid('');
    setDueDate('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 relative">
      {/* Fixed Header */}
      <div
        className="px-4 py-3 shadow-md flex items-center flex-shrink-0 z-20"
        style={{ backgroundColor: settings.theme.primaryColor }}
      >
        <button
          onClick={() => setSelectedCustomer(null)}
          className="mr-3 text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3"
          style={{ backgroundColor: settings.theme.accentColor }}
        >
          {selectedCustomer.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">{selectedCustomer.name}</h1>
          <p className="text-sm text-white/70">{selectedCustomer.id}</p>
        </div>
      </div>

      {/* Fixed Summary Section - Always visible at top */}
      <div className="bg-white shadow-md p-3 flex-shrink-0 z-10">
        {/* Main Balance Row */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('remainingBalance') || 'Remaining Balance'}</p>
            <p className={`text-2xl font-bold ${customerTotalRemaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {settings.currency} {customerTotalRemaining.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">{t('totalAmount') || 'Total'}</p>
            <p className="text-lg font-semibold text-gray-700">
              {settings.currency} {customerTotalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="bg-blue-50 rounded-lg py-2 px-1">
              <p className="text-xl font-bold text-blue-600">{totalEntries}</p>
              <p className="text-xs text-gray-500">{t('entries') || 'Entries'}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-green-50 rounded-lg py-2 px-1">
              <p className="text-xl font-bold text-green-600">{paidEntries}</p>
              <p className="text-xs text-gray-500">{t('paid') || 'Paid'}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-yellow-50 rounded-lg py-2 px-1">
              <p className="text-xl font-bold text-yellow-600">{pendingEntries}</p>
              <p className="text-xs text-gray-500">{t('pending') || 'Pending'}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-red-50 rounded-lg py-2 px-1">
              <p className="text-xl font-bold text-red-600">{overdueEntries}</p>
              <p className="text-xs text-gray-500">{t('overdue') || 'Overdue'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Entries List */}
      <div className="flex-1 overflow-y-auto p-3 pb-24">
        <h4 className="text-sm font-semibold text-gray-500 px-1 mb-3">{t('transactionHistory') || 'Transaction History'}</h4>

        {selectedCustomer.entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>{t('noEntries')}</p>
          </div>
        ) : (
          selectedCustomer.entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm mb-3">
              {/* Entry Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`text-sm font-semibold ${entry.remainingBalance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {t('remaining')}: {settings.currency} {entry.remainingBalance.toLocaleString()}
                </span>
              </div>

              {/* Products List */}
              <div className="space-y-2">
                {entry.products.map(product => {
                  const pTotal = product.quantity * product.price;
                  const pPaid = product.paidAmount || 0;
                  const pRemaining = product.isPaid ? 0 : Math.max(0, pTotal - pPaid);

                  return (
                    <div
                      key={product.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${product.isPaid || pRemaining <= 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center flex-1">
                        <button
                          onClick={() => toggleProductPaid(entry.id, product.id)}
                          disabled={product.isPaid || pRemaining <= 0}
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors flex-shrink-0 ${product.isPaid || pRemaining <= 0 ? 'bg-green-500 border-green-500 cursor-not-allowed cursor-default' : 'border-gray-300'
                            }`}
                        >
                          {(product.isPaid || pRemaining <= 0) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium truncate ${product.isPaid || pRemaining <= 0 ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.quantity} x {settings.currency} {product.price.toLocaleString()} = {settings.currency} {pTotal.toLocaleString()}
                          </p>
                          {pPaid > 0 && !product.isPaid && pRemaining > 0 && (
                            <p className="text-xs mt-0.5">
                              <span className="text-green-600 font-medium">{t('paid') || 'Paid'}: {settings.currency} {pPaid.toLocaleString()}</span>
                              <span className="text-red-500 font-medium ml-2">{t('remaining') || 'Rem'}: {settings.currency} {pRemaining.toLocaleString()}</span>
                            </p>
                          )}
                          {pPaid > 0 && (product.isPaid || pRemaining <= 0) && (
                            <p className="text-xs text-green-600 font-medium mt-0.5">{t('paid') || 'Paid'}: {settings.currency} {pPaid.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      <span className={`font-semibold ml-2 flex-shrink-0 ${(product.isPaid || pRemaining <= 0) ? 'text-green-600' : 'text-gray-700'}`}>
                        {settings.currency} {pTotal.toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Entry Footer */}
              <div className="flex items-start justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex gap-2 flex-wrap">
                  {entry.remainingBalance > 0 && (
                    <button
                      onClick={() => markAllPaid(entry.id)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg"
                    >
                      {t('payAll')}
                    </button>
                  )}
                  {isOverdue(entry) && (
                    <button className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-medium rounded-lg">
                      {t('sendReminder')}
                    </button>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-semibold text-gray-700">
                    {t('totalAmount')}: {settings.currency} {getEntryTotal(entry).toLocaleString()}
                  </p>
                  {entry.cashPaid > 0 && (
                    <p className="text-sm font-medium text-green-600 mt-1">
                      {t('cashPaid') || 'Cash Paid'}: {settings.currency} {entry.cashPaid.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Due Date */}
              {entry.dueDate && (
                <p className={`text-xs mt-2 ${isOverdue(entry) ? 'text-red-500' : 'text-gray-400'}`}>
                  {t('dueDate')}: {new Date(entry.dueDate).toLocaleDateString()}
                  {isOverdue(entry) && ' (Overdue)'}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Floating Add Entry Button */}
      <button
        onClick={() => setShowEntryForm(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl font-bold z-20"
        style={{ backgroundColor: settings.theme.accentColor }}
      >
        +
      </button>

      {/* Entry Form Modal - Centered Popup */}
      {showEntryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeEntryForm}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-4 flex-shrink-0"
              style={{ backgroundColor: settings.theme.primaryColor }}
            >
              <h3 className="font-semibold text-white text-lg">{t('addEntry')}</h3>
              <button onClick={closeEntryForm} className="text-white p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Product Input */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">{t('addProduct')}</p>
                <input
                  type="text"
                  placeholder={t('enterItemName')}
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm mb-2"
                />
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t('quantity')} <span className="text-gray-400">(Opt)</span></label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t('price')}</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t('paid')} <span className="text-gray-400">(Opt)</span></label>
                    <input
                      type="number"
                      value={newProduct.paidAmount}
                      onChange={(e) => setNewProduct({ ...newProduct, paidAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Display */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                  <div className="flex-1">
                    {price > 0 ? (
                      <div className="text-sm">
                        <span className="text-gray-500">{t('calculation') || 'Calculation'}: </span>
                        <span className="font-medium text-gray-700">
                          {quantity} × {settings.currency} {price.toLocaleString()}
                        </span>
                        <span className="ml-2 text-gray-800 font-bold">
                          = {settings.currency} {newProductTotal.toLocaleString()}
                        </span>
                        {productPaidAmount > 0 && (
                          <div className="text-xs mt-1">
                            <span className="text-green-600 font-medium">{t('paid') || 'Paid'}: {settings.currency} {productPaidAmount.toLocaleString()}</span>
                            <span className="text-red-500 font-medium ml-2">{t('remaining') || 'Rem'}: {settings.currency} {newProductRemaining.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        {t('enterQtyPrice') || 'Enter price to see calculation'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={addProductToList}
                    disabled={!newProduct.name.trim() || price <= 0}
                    className="px-4 py-2 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                    style={{ backgroundColor: settings.theme.accentColor }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Added Products List */}
              {products.length > 0 && (
                <div className="mb-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700 mb-2">{t('products')} ({products.length})</p>
                  {products.map((product, index) => {
                    const pTotal = product.quantity * product.price;
                    const pPaid = product.paidAmount || 0;
                    return (
                      <div key={product.id} className="flex items-center justify-between py-2 border-b border-green-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700 font-medium">
                            {index + 1}. {product.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({product.quantity} × {settings.currency} {product.price})
                          </span>
                          {pPaid > 0 && (
                            <span className="text-xs text-green-600 font-medium ml-2 block sm:inline mt-1 sm:mt-0">
                              {t('paid') || 'Paid'}: {settings.currency} {pPaid.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-semibold text-green-700">
                            {settings.currency} {pTotal.toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeProductFromList(product.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-200">
                    <p className="text-sm font-bold text-green-800">{t('totalAmount')}:</p>
                    <p className="text-lg font-bold text-green-700">{settings.currency} {totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Additional Fields */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t('cashPaid')} (Optional)</label>
                  <input
                    type="number"
                    value={cashPaid}
                    onChange={(e) => setCashPaid(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t('remaining')}</label>
                  <div className={`w-full px-3 py-2 rounded-lg text-sm font-semibold ${remainingBalance > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                    {settings.currency} {remainingBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t('purchaseDate')}</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t('dueDate')} (Optional)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={saveEntry}
                disabled={products.length === 0}
                className="w-full py-3 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: settings.theme.primaryColor }}
              >
                {t('save')} Entry ({products.length} {products.length === 1 ? 'item' : 'items'})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
