import React, { useState, useMemo } from 'react';
import { Car, Utensils, Package, ChevronRight, ChevronDown, MapPin, Receipt, BedDouble, RefreshCw } from 'lucide-react';
import { HISTORICAL_ACTIVITY } from '../constants';
import { ProviderBadge } from '../components/ProviderBadge';
import { ActivityItem } from '../types';

interface ActivityViewProps {
  activities: ActivityItem[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities, setActivities }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newActivities = [...activities, ...HISTORICAL_ACTIVITY];
      const uniqueActivities = Array.from(new Map(newActivities.map(item => [item.id, item])).values());
      setActivities(uniqueActivities);
      setIsSyncing(false);
    }, 2000);
  };

  const providers = useMemo(() => {
    const uniqueProviders = new Set(activities.map(a => a.provider));
    return ['all', ...Array.from(uniqueProviders)];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activities;
    return activities.filter(a => a.provider === activeFilter);
  }, [activities, activeFilter]);

  return (
    <div className="min-h-screen bg-brand-950 pb-24 font-sans text-slate-100">
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

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {providers.map(provider => (
            <button
              key={provider}
              onClick={() => setActiveFilter(provider)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors capitalize ${
                activeFilter === provider 
                  ? 'bg-brand-600 text-white border-brand-600' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 font-medium">No activity found for this filter.</p>
            </div>
          ) : filteredActivities.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="bg-slate-900 rounded-3xl shadow-soft border border-slate-800/80 overflow-hidden transition-all">
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 flex items-center active:bg-slate-800/40 cursor-pointer"
                >
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
                
                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/50 bg-slate-950/50">
                    <div className="space-y-3 text-sm">
                      {item.type === 'ride' && (
                        <>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-slate-500 text-xs font-medium">Dropoff</p>
                              <p className="font-semibold text-white">Tech Park, Outer Ring Road</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Car className="w-4 h-4 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-slate-500 text-xs font-medium">Vehicle</p>
                              <p className="font-semibold text-white">Chalo Mini • KA 01 AB 1234</p>
                            </div>
                          </div>
                        </>
                      )}
                      {(item.type === 'food' || item.type === 'mart' || item.type === 'stays') && (
                        <>
                          <div className="flex items-start gap-2">
                            <Receipt className="w-4 h-4 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-slate-500 text-xs font-medium">Booking Details</p>
                              <p className="font-semibold text-white">ID #CH-{Math.floor(Math.random() * 100000)}</p>
                              <p className="text-slate-400 mt-1 text-xs font-medium">Paid via Chalo Pay</p>
                            </div>
                          </div>
                        </>
                      )}
                      <button className="w-full mt-3 py-2.5 bg-slate-850 border border-slate-800 rounded-xl font-bold text-slate-300 active:bg-slate-800 transition-colors shadow-sm">
                        {item.type === 'ride' ? 'Report Issue' : item.type === 'stays' ? 'Book Again' : 'Reorder'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};