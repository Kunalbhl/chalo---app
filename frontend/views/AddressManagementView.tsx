import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus, Star, Check, Trash2, Search, Navigation, Loader2, X } from 'lucide-react';
import { SavedAddress } from '../types';

interface AddressManagementViewProps {
  onBack: () => void;
  savedAddresses: SavedAddress[];
  onUpdateAddresses: (addresses: SavedAddress[]) => void;
}

// Mock Pincode to City/State mapping
const PINCODE_MAP: Record<string, { city: string, state: string }> = {
  '560038': { city: 'Bengaluru', state: 'Karnataka' },
  '560103': { city: 'Bengaluru', state: 'Karnataka' },
  '400050': { city: 'Mumbai', state: 'Maharashtra' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
};

export const AddressManagementView: React.FC<AddressManagementViewProps> = ({ onBack, savedAddresses, onUpdateAddresses }) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [customName, setCustomName] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  // Form States
  const [flatNo, setFlatNo] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isPreferredAddress, setIsPreferredAddress] = useState(true);
  
  // Simulated Map Coordinates & Address
  const [mapAddress, setMapAddress] = useState('Indiranagar Metro Station, Bengaluru, Karnataka');
  const [mapLat, setMapLat] = useState(12.9716);
  const [mapLng, setMapLng] = useState(77.5946);

  const handleSetPreferred = (id: string) => {
    const updated = savedAddresses.map(addr => ({
      ...addr,
      isPreferred: addr.id === id
    }));
    onUpdateAddresses(updated);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = savedAddresses.filter(addr => addr.id !== id);
    onUpdateAddresses(updated);
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setMapAddress('Brigade Road, Ashok Nagar, Bengaluru, Karnataka');
      setArea('Brigade Road, Ashok Nagar');
      setPincode('560001');
      setCity('Bengaluru');
      setState('Karnataka');
      setMapLat(12.9719);
      setMapLng(77.6115);
      setIsLocating(false);
    }, 1500);
  };

  const handlePincodeChange = (val: string) => {
    setPincode(val);
    if (val.length === 6) {
      const mapped = PINCODE_MAP[val];
      if (mapped) {
        setCity(mapped.city);
        setState(mapped.state);
      } else {
        // Mock fallback
        setCity('Bengaluru');
        setState('Karnataka');
      }
    } else {
      setCity('');
      setState('');
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${flatNo}, ${area}, ${city}, ${state} ${pincode}`;
    const newAddress: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: selectedLabel,
      customName: selectedLabel === 'Other' ? customName : undefined,
      flatNo,
      area,
      city,
      state,
      pincode,
      fullAddress,
      address: fullAddress, // For backward compatibility
      isPrimary: false,
      isPreferred: isPreferredAddress,
      lat: mapLat,
      lng: mapLng
    };

    let updatedAddresses = [...savedAddresses];
    if (isPreferredAddress) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isPreferred: false }));
    }
    updatedAddresses.push(newAddress);

    onUpdateAddresses(updatedAddresses);
    setShowMapModal(false);
    setCustomName('');
    setFlatNo('');
    setArea('');
    setPincode('');
    setCity('');
    setState('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 relative">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-900 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">Saved Places</h1>
            <p className="text-xs font-medium text-slate-400">Manage your delivery & pickup addresses</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {savedAddresses.map((addr) => (
          <div key={addr.id} className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-soft flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-brand-500/10 p-2.5 rounded-xl border border-brand-500/20 text-brand-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {addr.label === 'Other' ? addr.customName || 'Other' : addr.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{addr.city || 'Bengaluru'}, India</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteAddress(addr.id)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {addr.fullAddress || addr.address}
            </p>

            <div className="flex gap-2 pt-2 border-t border-slate-200/60">
              <button 
                onClick={() => handleSetPreferred(addr.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  addr.isPreferred 
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {addr.isPreferred && <Star className="w-3.5 h-3.5 fill-slate-950" />}
                Preferred
              </button>
            </div>
          </div>
        ))}

        {savedAddresses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 font-medium">No saved addresses yet.</p>
            <p className="text-xs text-slate-400 mt-1">Add your Home or Work address for faster checkouts.</p>
          </div>
        )}

        <button 
          onClick={() => setShowMapModal(true)}
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-base shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Address
        </button>
      </div>

      {/* Interactive Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowMapModal(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>
            <button 
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-4">Choose Location</h2>

            {/* Simulated Map Canvas/SVG */}
            <div className="w-full h-48 bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden mb-4 shadow-inner">
              {/* Mock Map Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 20 L 500 20 M 0 60 L 500 60 M 0 100 L 500 100 M 0 140 L 500 140 M 0 180 L 500 180" stroke="#94a3b8" strokeWidth="2" />
                <path d="M 50 0 L 50 200 M 150 0 L 150 200 M 250 0 L 250 200 M 350 0 L 350 200 M 450 0 L 450 200" stroke="#94a3b8" strokeWidth="2" />
                {/* Lake */}
                <circle cx="300" cy="100" r="30" fill="#93c5fd" opacity="0.6" />
                {/* Park */}
                <rect x="80" y="40" width="50" height="40" rx="8" fill="#86efac" opacity="0.6" />
              </svg>

              {/* Center Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="bg-brand-600 text-white p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="w-2 h-2 bg-slate-900/30 rounded-full blur-[1px] mt-1"></div>
              </div>

              {/* Locate Me Button */}
              <button 
                onClick={handleLocateMe}
                disabled={isLocating}
                className="absolute bottom-3 right-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-md text-brand-600 active:scale-95 transition-all"
              >
                {isLocating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Address Details Form */}
            <form onSubmit={handleSaveNewAddress} className="space-y-4 flex-1">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detected Address</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">{mapAddress}</p>
              </div>

              {/* Label Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Save As</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setSelectedAddressLabel(lbl)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedLabel === lbl 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {selectedLabel === 'Other' && (
                <div className="animate-[fadeIn_0.2s_ease-out]">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Custom Label Name</label>
                  <input 
                    type="text" 
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Gym, Friend's House" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Flat / House No. / Floor / Building</label>
                  <input 
                    type="text" 
                    required
                    value={flatNo}
                    onChange={(e) => setFlatNo(e.target.value)}
                    placeholder="e.g. Flat 402, Block B" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Area / Sector / Locality</label>
                  <input 
                    type="text" 
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Indiranagar" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pincode</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 560038" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                    <input 
                      type="text" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">State</label>
                  <input 
                    type="text" 
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="setPreferredAddr" 
                    checked={isPreferredAddress}
                    onChange={(e) => setIsPreferredAddress(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 accent-brand-600"
                  />
                  <label htmlFor="setPreferredAddr" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Set as Preferred Address
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base shadow-md transition-colors"
              >
                Confirm & Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};