import { useApp } from '../context/AppContext';

export function Reports() {
  const { customers, settings, t } = useApp();

  const totalCustomers = customers.length;
  
  const totalReceivables = customers.reduce((sum, customer) => {
    return sum + customer.entries.reduce((entrySum, entry) => entrySum + entry.remainingBalance, 0);
  }, 0);

  const totalReceived = customers.reduce((sum, customer) => {
    return sum + customer.entries.reduce((entrySum, entry) => entrySum + entry.cashPaid, 0);
  }, 0);

  const overduePayments = customers.reduce((sum, customer) => {
    return sum + customer.entries.filter(entry => {
      if (!entry.dueDate || entry.remainingBalance <= 0) return false;
      return new Date(entry.dueDate) < new Date();
    }).reduce((entrySum, entry) => entrySum + entry.remainingBalance, 0);
  }, 0);

  const customersWithBalance = customers
    .map(customer => ({
      ...customer,
      totalBalance: customer.entries.reduce((sum, entry) => sum + entry.remainingBalance, 0)
    }))
    .filter(customer => customer.totalBalance > 0)
    .sort((a, b) => b.totalBalance - a.totalBalance);

  const overdueCustomers = customers
    .map(customer => {
      const overdueEntries = customer.entries.filter(entry => {
        if (!entry.dueDate || entry.remainingBalance <= 0) return false;
        return new Date(entry.dueDate) < new Date();
      });
      const overdueAmount = overdueEntries.reduce((sum, entry) => sum + entry.remainingBalance, 0);
      return { ...customer, overdueAmount, overdueEntries };
    })
    .filter(customer => customer.overdueAmount > 0);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div 
        className="px-4 py-4 shadow-sm"
        style={{ backgroundColor: settings.theme.primaryColor }}
      >
        <h1 className="text-xl font-bold text-white">{t('reports')}</h1>
        <p className="text-sm text-white/70">{t('reportTitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('totalCustomers')}</p>
                <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('totalReceivables')}</p>
                <p className="text-xl font-bold text-red-500">{settings.currency} {totalReceivables.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('totalReceived')}</p>
                <p className="text-xl font-bold text-green-500">{settings.currency} {totalReceived.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('overduePayments')}</p>
                <p className="text-xl font-bold text-orange-500">{settings.currency} {overduePayments.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Customers with Balance */}
        <div className="bg-white rounded-xl shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Customers with Balance</h2>
          </div>
          {customersWithBalance.length === 0 ? (
            <p className="p-4 text-gray-400 text-center text-sm">No pending balances</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {customersWithBalance.map(customer => (
                <div key={customer.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3"
                      style={{ backgroundColor: settings.theme.accentColor }}
                    >
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{customer.name}</p>
                      <p className="text-xs text-gray-400">{customer.id}</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-semibold">
                    {settings.currency} {customer.totalBalance.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue Customers */}
        {overdueCustomers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-orange-50 rounded-t-xl">
              <h2 className="font-semibold text-orange-700">⚠️ Overdue Payments</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {overdueCustomers.map(customer => (
                <div key={customer.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold mr-2 text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-gray-800">{customer.name}</p>
                    </div>
                    <span className="text-orange-500 font-semibold">
                      {settings.currency} {customer.overdueAmount.toLocaleString()}
                    </span>
                  </div>
                  {customer.overdueEntries.map(entry => (
                    <div key={entry.id} className="ml-10 text-xs text-gray-500 mt-1">
                      Due: {new Date(entry.dueDate).toLocaleDateString()} - {settings.currency} {entry.remainingBalance.toLocaleString()}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
