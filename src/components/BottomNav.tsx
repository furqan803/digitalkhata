import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export function BottomNav() {
  const { activeTab, setActiveTab, selectedCustomer, setSelectedCustomer, currentUserRole, settings, t } = useApp();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'customers',
      label: t('customers'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'notebook',
      label: t('notebook'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: t('settings'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const visibleTabs = tabs.filter(tab => {
    if (tab.id === 'reports' && currentUserRole === 'staff') return false;
    return true;
  });

  const handleTabClick = (tab: TabType) => {
    if (selectedCustomer && tab !== 'customers') {
      setSelectedCustomer(null);
    }
    setActiveTab(tab);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex justify-around items-center safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors duration-500">
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${activeTab === tab.id || (tab.id === 'customers' && selectedCustomer)
            ? 'text-green-600'
            : 'text-gray-400 hover:text-gray-600'
            }`}
          style={{
            color: (activeTab === tab.id || (tab.id === 'customers' && selectedCustomer))
              ? settings.theme.primaryColor
              : undefined
          }}
        >
          {tab.icon}
          <span className="text-xs mt-1 font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
