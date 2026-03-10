import { useState, useEffect } from 'react';
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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // If the height decreases significantly, the keyboard is likely open
      if (window.visualViewport) {
        // More accurate for modern mobile browsers
        const isVisible = window.visualViewport.height < window.innerHeight * 0.75;
        setIsKeyboardVisible(isVisible);
      } else {
        const isVisible = window.innerHeight < 500; // rough estimate
        setIsKeyboardVisible(isVisible);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 dark:bg-gray-950 shadow-2xl overflow-hidden transition-colors duration-500">
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </main>
      {!isKeyboardVisible && <BottomNav />}
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
