import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { setIsLoggedIn, setCurrentUserRole, settings, t, setShopNameFromLogin } = useApp();
  const [role, setRole] = useState<'admin' | 'staff'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      if (settings.appLockPin) {
        // App lock is enabled
        if (pin === settings.appLockPin) {
          setIsLoggedIn(true);
          setCurrentUserRole('admin');
        } else {
          setError('Invalid Admin PIN');
        }
      } else {
        // Normal mockup login
        if (username && password) {
          setShopNameFromLogin(username);
          setIsLoggedIn(true);
          setCurrentUserRole('admin');
        } else {
          setError('Please enter username and password');
        }
      }
    } else {
      // Staff login
      const staff = settings.staffAccounts.find(s => s.id === selectedStaffId);
      if (staff && staff.pin === pin) {
        setIsLoggedIn(true);
        setCurrentUserRole('staff');
      } else {
        setError('Invalid Staff selection or PIN');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-500">
      {/* Logo and App Name */}
      <div className="mb-8 text-center">
        <div
          className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center mb-4 mx-auto"
          style={{ backgroundColor: settings.theme.primaryColor }}
        >
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: settings.language === 'ur' ? 'serif' : 'sans-serif' }}>
          {t('appName')}
        </h1>
        <p className="text-gray-500 mt-1">Smart Security Enabled</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-700 p-6">

        {/* Role Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${role === 'admin' ? 'bg-white shadow-sm text-gray-800 dark:bg-gray-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t('adminLogin') || 'Admin'}
          </button>
          <button
            type="button"
            onClick={() => setRole('staff')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${role === 'staff' ? 'bg-white shadow-sm text-gray-800 dark:bg-gray-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t('staffLogin') || 'Staff'}
          </button>
        </div>

        {role === 'admin' && !settings.appLockPin && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={settings.language === 'ur' ? 'صارف نام' : 'Enter username'}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={settings.language === 'ur' ? 'پاس ورڈ' : 'Enter password'}
              />
            </div>
          </>
        )}

        {role === 'admin' && settings.appLockPin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('appLock')}</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-lg"
              placeholder="****"
              maxLength={4}
            />
          </div>
        )}

        {role === 'staff' && (
          <>
            {settings.staffAccounts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mb-4">No staff accounts configured. Admin must add staff in settings first.</p>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('staffAccounts')}</label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>Select Staff Member</option>
                    {settings.staffAccounts.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))}
                  </select>
                </div>
                {selectedStaffId && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-lg"
                      placeholder="****"
                      maxLength={4}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={role === 'staff' && settings.staffAccounts.length === 0}
          className="w-full py-3 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
          style={{ backgroundColor: settings.theme.primaryColor }}
        >
          {t('login')}
        </button>
      </form>

      <p className="mt-8 text-gray-400 text-sm">Developed by Furqan</p>
    </div>
  );
}
