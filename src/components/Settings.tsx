import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { settings, updateSettings, logout, currentUserRole, t } = useApp();
  const [showShopNameModal, setShowShopNameModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAppLockModal, setShowAppLockModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  const [newShopName, setNewShopName] = useState(settings.shopName);
  const [appLockPin, setAppLockPin] = useState(settings.appLockPin || '');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');

  const handleSaveShopName = () => {
    if (newShopName.trim()) {
      updateSettings({ shopName: newShopName.trim() });
      setShowShopNameModal(false);
    }
  };

  const handleSaveAppLock = () => {
    updateSettings({ appLockPin });
    setShowAppLockModal(false);
  };

  const handleAddStaff = () => {
    if (newStaffName.trim() && newStaffPin.trim()) {
      const newStaff = {
        id: `S${Date.now()}`,
        name: newStaffName.trim(),
        pin: newStaffPin.trim()
      };
      updateSettings({ staffAccounts: [...settings.staffAccounts, newStaff] });
      setNewStaffName('');
      setNewStaffPin('');
      setShowStaffModal(false);
    }
  };

  const handleDeleteStaff = (id: string) => {
    updateSettings({ staffAccounts: settings.staffAccounts.filter(s => s.id !== id) });
  };

  const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'INR'];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div
        className="px-4 py-4 shadow-sm"
        style={{ backgroundColor: settings.theme.primaryColor }}
      >
        <h1 className="text-xl font-bold text-white">{t('settings')}</h1>
        <p className="text-sm text-white/70">{settings.shopName}</p>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentUserRole === 'admin' ? (
          <>
            {/* Shop Name */}
            <div className="bg-white rounded-xl shadow-sm mb-3">
              <button
                onClick={() => setShowShopNameModal(true)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${settings.theme.primaryColor}20` }}
                  >
                    <svg className="w-5 h-5" style={{ color: settings.theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{t('shopName')}</p>
                    <p className="text-sm text-gray-500">{settings.shopName}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Language */}
            <div className="bg-white rounded-xl shadow-sm mb-3">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${settings.theme.primaryColor}20` }}
                  >
                    <svg className="w-5 h-5" style={{ color: settings.theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t('language')}</p>
                    <p className="text-sm text-gray-500">{settings.language === 'en' ? 'English' : 'اردو'}</p>
                  </div>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'ur' })}
                  className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="ur">اردو</option>
                </select>
              </div>
            </div>

            {/* Currency */}
            <div className="bg-white rounded-xl shadow-sm mb-3">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${settings.theme.primaryColor}20` }}
                  >
                    <svg className="w-5 h-5" style={{ color: settings.theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t('currency_label')}</p>
                    <p className="text-sm text-gray-500">{settings.currency}</p>
                  </div>
                </div>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                  className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 focus:outline-none"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="bg-white rounded-xl shadow-sm mb-3">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${settings.theme.primaryColor}20` }}
                  >
                    <svg className="w-5 h-5" style={{ color: settings.theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t('darkMode')}</p>
                    <p className="text-sm text-gray-500">{settings.darkMode ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.darkMode ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Theme Color */}
            <div className="bg-white rounded-xl shadow-sm mb-3">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${settings.theme.primaryColor}20` }}
                  >
                    <svg className="w-5 h-5" style={{ color: settings.theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800">Theme Color</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'].map(color => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ theme: { primaryColor: color, accentColor: color } })}
                      className={`w-10 h-10 rounded-full border-2 ${settings.theme.primaryColor === color ? 'border-gray-800' : 'border-transparent'
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>


            {/* Premium Features */}
            <div className="mb-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t('premiumFeatures')}</h2>

              {/* App Lock */}
              <div className="bg-white rounded-xl shadow-sm mb-2">
                <button
                  onClick={() => setShowAppLockModal(true)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-yellow-400 to-yellow-600"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{t('appLock')}</p>
                      <p className="text-xs text-gray-500">{settings.appLockPin ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Auto Reminders */}
              <div className="bg-white rounded-xl shadow-sm mb-2">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-green-400 to-green-600"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{t('autoReminders')}</p>
                      <p className="text-xs text-gray-500">PRO Feature</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoReminders: !settings.autoReminders })}
                    className={`w-11 h-6 rounded-full transition-colors relative ${settings.autoReminders ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.autoReminders ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {/* Staff Accounts */}
              <div className="bg-white rounded-xl shadow-sm mb-2">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-blue-400 to-blue-600">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{t('staffAccounts')}</p>
                        <p className="text-xs text-gray-500">{settings.staffAccounts.length} Staff Member(s)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowStaffModal(true)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: settings.theme.primaryColor }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>

                  {settings.staffAccounts.map(staff => (
                    <div key={staff.id} className="flex justify-between items-center py-2 border-t border-gray-100 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{staff.name}</p>
                        <p className="text-xs text-gray-400">PIN: ****</p>
                      </div>
                      <button onClick={() => handleDeleteStaff(staff.id)} className="text-red-400 hover:text-red-500 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2 ml-1">Staff Member</h2>
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-800">Staff View</p>
                <p className="text-sm text-gray-500">Only basic adding allowed</p>
              </div>
            </div>
          </div>
        )}

        {/* Developer Info / About App */}
        <div className="bg-white rounded-xl shadow-sm mb-3">
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${settings.theme.primaryColor}20` }}
              >
                <svg className="w-5 h-5" style={{ color: settings.theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">{t('developer')}</p>
                <p className="text-sm text-gray-500">Furqan • Tap for info</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full mt-4 py-3 bg-red-50 text-red-600 font-medium rounded-xl flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t('logout')}
        </button>
      </div>

      {/* Shop Name Modal */}
      {showShopNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('shopName')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('shopName')}</label>
              <input
                type="text"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={settings.language === 'ur' ? 'دکان کا نام' : 'Enter shop name'}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShopNameModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveShopName}
                className="flex-1 py-2.5 text-white font-medium rounded-xl"
                style={{ backgroundColor: settings.theme.primaryColor }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* App Lock Modal */}
      {showAppLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{t('appLock')}</h2>
            <p className="text-sm text-gray-500 text-center mb-4">Set a 4-digit PIN for admin access. Leave empty to disable.</p>

            <div>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={appLockPin}
                onChange={(e) => setAppLockPin(e.target.value)}
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-xl"
                placeholder="****"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setAppLockPin(settings.appLockPin || '');
                  setShowAppLockModal(false);
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveAppLock}
                className="flex-1 py-2.5 text-white font-medium rounded-xl"
                style={{ backgroundColor: settings.theme.primaryColor }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Profile Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('addStaff')}</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Staff Member Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code (4-digits)</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={newStaffPin}
                onChange={(e) => setNewStaffPin(e.target.value)}
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest text-center text-lg"
                placeholder="****"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setNewStaffName('');
                  setNewStaffPin('');
                  setShowStaffModal(false);
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddStaff}
                disabled={!newStaffName.trim() || !newStaffPin.trim()}
                className="flex-1 py-2.5 text-white font-medium rounded-xl disabled:opacity-50"
                style={{ backgroundColor: settings.theme.primaryColor }}
              >
                {t('add') || 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About App Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAboutModal(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-xl flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Digital Khata</h2>
              <button onClick={() => setShowAboutModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto">
              {/* App Logo */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: settings.theme.primaryColor }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 font-medium">Business Ledger App</p>
                <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">About App</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Digital Khata is a simple and easy-to-use ledger app for small business owners.
                  Manage customer payments, track product entries, set due dates, and send reminders
                  - all in one place.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Customer Management
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multiple Product Entries
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Partial Payment Tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Due Date Reminders
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Notes & Reports
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Urdu & English Support
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Developed by</p>
                    <p className="text-xl font-bold text-gray-800">Furqan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-2.5 text-white font-medium rounded-xl transition-colors hover:opacity-90"
                style={{ backgroundColor: settings.theme.primaryColor }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
