import React, { useState, useRef } from 'react';
import { User, CreditCard, Settings, HelpCircle, ChevronRight, LogOut, Link as LinkIcon, Edit2, X, ShieldCheck, Bell, Mail, Smartphone, MapPin, Moon, Sun, Monitor, Camera } from 'lucide-react';
import { ViewState, Theme } from '../types';

interface AccountViewProps {
  onChangeView: (view: ViewState) => void;
  profileName: string;
  onUpdateProfile: (name: string) => void;
  profileEmail: string;
  onUpdateEmail: (email: string) => void;
  profilePhone: string;
  onUpdatePhone: (phone: string) => void;
  profileGender: 'Male' | 'Female' | 'Other';
  onUpdateGender: (gender: 'Male' | 'Female' | 'Other') => void;
  profilePic: string;
  onUpdateProfilePic: (pic: string) => void;
  appTheme: Theme;
  onUpdateTheme: (theme: Theme) => void;
  preferredPayment: string;
  onUpdatePreferredPayment: (methodId: string) => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  onLogout: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ 
  onChangeView, 
  profileName, 
  onUpdateProfile, 
  profileEmail,
  onUpdateEmail,
  profilePhone,
  onUpdatePhone,
  profileGender,
  onUpdateGender,
  profilePic,
  onUpdateProfilePic,
  appTheme,
  onUpdateTheme,
  preferredPayment, 
  onUpdatePreferredPayment, 
  isEditingProfile, 
  setIsEditingProfile,
  onLogout
}) => {
  const [tempName, setTempName] = useState(profileName);
  const [tempEmail, setTempEmail] = useState(profileEmail);
  const [tempPhone, setTempPhone] = useState(profilePhone);
  const [tempGender, setTempGender] = useState<'Male' | 'Female' | 'Other'>(profileGender);
  const [tempPic, setTempPic] = useState(profilePic);
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [tempTheme, setTempTheme] = useState<Theme>(appTheme);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateProfile(tempName.trim());
      onUpdateEmail(tempEmail.trim());
      onUpdatePhone(tempPhone.trim());
      onUpdateGender(tempGender);
      onUpdateProfilePic(tempPic);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    }
  };

  const handleSaveSettings = () => {
    onUpdateTheme(tempTheme);
    setShowSettingsModal(false);
    alert('Settings saved successfully!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-slate-800">
      {/* Premium Black Header */}
      <div className="bg-slate-950 pt-14 pb-12 px-6 text-white rounded-b-[2.5rem] shadow-md border-b border-slate-900">
        <div className="flex items-center">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-800 mr-4 shadow-inner rotate-3" />
          ) : (
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-inner rotate-3">
              <div className="-rotate-3">{profileName.charAt(0)}</div>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{profileName}</h1>
              <button onClick={() => setIsEditingProfile(true)} className="p-1 text-slate-400 hover:text-white transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1 space-y-0.5">
              <p className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> {profilePhone}
              </p>
              <p className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {profileEmail}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-6 -mt-6 relative z-10">
        <div className="bg-slate-50 rounded-3xl shadow-soft border border-slate-100 overflow-hidden mb-4">
          <MenuItem 
            icon={<LinkIcon className="w-5 h-5" />} 
            title="Linked Accounts" 
            subtitle="Manage Uber, Zomato, Airbnb..." 
            onClick={() => onChangeView('linked_accounts')}
          />
          <MenuItem 
            icon={<CreditCard className="w-5 h-5" />} 
            title="Payment Methods" 
            subtitle="Cards, UPI, Wallets" 
            onClick={() => onChangeView('payment_methods')}
          />
          <MenuItem 
            icon={<MapPin className="w-5 h-5" />} 
            title="Saved Places" 
            subtitle="Home, Work & more" 
            onClick={() => onChangeView('address_management')}
          />
        </div>

        <div className="bg-slate-50 rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
          <MenuItem 
            icon={<Settings className="w-5 h-5" />} 
            title="Settings" 
            subtitle="App theme & notifications" 
            onClick={() => setShowSettingsModal(true)}
          />
          <MenuItem 
            icon={<HelpCircle className="w-5 h-5" />} 
            title="Help & Support" 
            subtitle="Chatbot, FAQs, Contact us" 
            onClick={() => onChangeView('support')}
          />
        </div>

        <button 
          onClick={onLogout}
          className="w-full mt-6 bg-slate-50 p-4 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-center text-rose-500 font-bold active:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)}></div>
          <div className="bg-white rounded-[2rem] p-6 relative z-10 border border-slate-100 w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar animate-[fadeIn_0.2s_ease-out] text-slate-800 shadow-2xl">
            <button 
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="relative mb-4">
                {tempPic ? (
                  <img src={tempPic} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm" />
                ) : (
                  <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                    <User className="w-10 h-10 text-indigo-600" />
                  </div>
                )}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-brand-600 text-white p-2 rounded-full shadow-md hover:bg-brand-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Edit Profile</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Update your personal information</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Kunal Pareek" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    placeholder="kunal.pareek@gmail.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    required
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    placeholder="+91 98765 43210" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                <div className="flex gap-2">
                  {(['Male', 'Female', 'Other'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setTempGender(g)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        tempGender === g 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)}></div>
          <div className="bg-white rounded-[2rem] p-6 relative z-10 border border-slate-100 w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar animate-[fadeIn_0.2s_ease-out] text-slate-800 shadow-2xl">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                <Settings className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">App Settings</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Customize your Chalo experience</p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Monitor className="w-4 h-4 text-brand-600" /> App Theme
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setTempTheme('system')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${tempTheme === 'system' ? 'border-brand-500 bg-brand-50/50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <Monitor className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">System</span>
                </button>
                <button 
                  onClick={() => setTempTheme('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${tempTheme === 'light' ? 'border-brand-500 bg-brand-50/50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <Sun className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">Light</span>
                </button>
                <button 
                  onClick={() => setTempTheme('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${tempTheme === 'dark' ? 'border-brand-500 bg-brand-50/50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <Moon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">Dark</span>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" /> Notifications
              </h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Push Notifications</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Order updates, ride status, and offers</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-brand-600 relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-transform"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveSettings}
              className="w-full py-4 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
            >
              Save Settings
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pt-4 mt-4 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4" /> Settings Secured & Saved
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, title, subtitle, onClick, badge }: { icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void, badge?: string }) => (
  <button onClick={onClick} className="w-full flex items-center p-4 border-b border-slate-100 last:border-0 active:bg-slate-100/50 transition-colors text-left group">
    <div className="text-slate-400 group-hover:text-brand-600 transition-colors mr-4 bg-white p-2.5 rounded-xl border border-slate-200">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-slate-800">{title}</h3>
        {badge && <span className="bg-brand-500/10 text-brand-600 border border-brand-500/20 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{badge}</span>}
      </div>
      {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
  </button>
);
