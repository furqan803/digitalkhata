import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { CustomerList } from './components/CustomerList';
import { KhataDetail } from './components/KhataDetail';
import { Notebook } from './components/Notebook';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';

function AppContent() {
  const { isLoggedIn, activeTab, selectedCustomer } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (selectedCustomer) {
      return <KhataDetail />;
    }

    switch (activeTab) {
      case 'customers':
        return <CustomerList />;
      case 'notebook':
        return <Notebook />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <CustomerList />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden">
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </main>
      <BottomNav />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
