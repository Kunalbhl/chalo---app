import React, { useState, useMemo, useEffect } from 'react';
import { Car, Utensils, Package, ChevronRight, ChevronDown, MapPin, Receipt, BedDouble, RefreshCw, Download, Share2, X, CheckCircle2 } from 'lucide-react';
import { HISTORICAL_ACTIVITY } from '../constants';
import { ProviderBadge } from '../components/ProviderBadge';
import { ActivityItem } from '../types';

interface ActivityViewProps {
  activities: ActivityItem[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities, setActivities }) => {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasAutoSynced, setHasAutoSynced] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  // Auto-sync on mount
  useEffect(() => {
    if (!hasAutoSynced) {
      handleSync();
      setHasAutoSynced(true);
    }
  }, [hasAutoSynced]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newActivities = [...activities, ...HISTORICAL_ACTIVITY];
      const uniqueActivities = Array.from(new Map(newActivities.map(item => [item.id, item])).values());
      setActivities(uniqueActivities);
      setIsSyncing(false);
    }, 1500);
  };

  const ongoingActivities = useMemo(() => activities.filter(a => a.status === 'ongoing'), [activities]);
  const pastActivities = useMemo(() => activities.filter(a => a.status !== 'ongoing'), [activities]);

  const displayActivities = activeTab === 'ongoing' ? ongoingActivities : pastActivities;

  const handleDownloadReceipt = () => {
    alert('Receipt PDF downloaded successfully!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Chalo Order Details',
        text: `Check out my order details for ${selectedActivity?.title} on Chalo!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`Order details for ${selectedActivity?.title} on Chalo!`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 pb-24 font-sans text-slate-100 relative">
      <div className="bg-slate-900/80 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-10 border-b border-slate-800/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Activity</h1>
          <button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="flex items-center text-brand-400 text-sm font-bold bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg active:bg-brand-500/20 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Orders'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ongoing' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Ongoing ({ongoingActivities.length})
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'past' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Past Orders
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {displayActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 font-medium">No {activeTab} activity found.</p>
            </div>
          ) : displayActivities.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedActivity(item)}
              className="bg-slate-900 rounded-3xl shadow-soft border border-slate-800/80 overflow-hidden transition-all hover:border-brand-500/50 cursor-pointer active:scale-[0.98]"
            >
              <div className="p-4 flex items-center">
                <div className={`p-3.5 rounded-2xl mr-4 ${
                  item.type === 'ride' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  item.type === 'food' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                  item.type === 'stays' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {item.type === 'ride' && <Car className="w-6 h-6" />}
                  {item.type === 'food' && <Utensils className="w-6 h-6" />}
                  {item.type === 'mart' && <Package className="w-6 h-6" />}
                  {item.type === 'stays' && <BedDouble className="w-6 h-6" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ProviderBadge provider={item.provider} />
                  </div>
                  <h3 className="font-bold text-white text-[15px] leading-tight">{item.title}</h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">{item.date}</p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="font-bold text-white">₹{item.price}</span>
                  <div className="flex items-center mt-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedActivity(null)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[92vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border shadow-sm ${
                  selectedActivity.type === 'ride' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                  selectedActivity.type === 'food' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                  selectedActivity.type === 'stays' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                  'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}>
                {selectedActivity.type === 'ride' && <Car className="w-8 h-8" />}
                {selectedActivity.type === 'food' && <Utensils className="w-8 h-8" />}
                {selectedActivity.type === 'mart' && <Package className="w-8 h-8" />}
                {selectedActivity.type === 'stays' && <BedDouble className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{selectedActivity.title}</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">{selectedActivity.date}</p>
              <div className="mt-3">
                <ProviderBadge provider={selectedActivity.provider} />
              </div>
            </div>

            {/* Receipt Details */}
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 mb-6 relative overflow-hidden">
              {/* Receipt jagged edge effect */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNmOGZhZmMiLz48L3N2Zz4=')] rotate-180"></div>
              
              <div className="flex justify-between items-center mb-4 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Status</span>
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                  selectedActivity.status === 'completed' ? 'text-emerald-600' :
                  selectedActivity.status === 'cancelled' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {selectedActivity.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  {selectedActivity.status}
                </span>
              </div>

              <div className="space-y-3 border-t border-slate-200/60 pt-4">
                <div className="flex justify-between text-sm font-semibold text-slate-600">
                  <span>Order ID</span>
                  <span className="font-mono text-slate-800">CH-{selectedActivity.id.split('-')[1]}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-600">
                  <span>Payment Method</span>
                  <span className="text-slate-800">Chalo Pay</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-600">
                  <span>Base Amount</span>
                  <span className="text-slate-800">₹{selectedActivity.price - (selectedActivity.type === 'stays' ? 1500 : 25)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-600">
                  <span>Taxes & Fees</span>
                  <span className="text-slate-800">₹{selectedActivity.type === 'stays' ? 1500 : 25}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/60">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="font-black text-xl text-brand-600">₹{selectedActivity.price}</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNmOGZhZmMiLz48L3N2Zz4=')]"></div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share Details
              </button>
            </div>
            
            <button className="w-full mt-3 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors">
              {selectedActivity.type === 'ride' ? 'Report Issue' : selectedActivity.type === 'stays' ? 'Book Again' : 'Reorder'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
