import React, { useState } from 'react';
import { Search, ArrowLeft, Filter, Star, Clock, TrendingDown } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface SearchViewProps {
  onNavigate: (tab: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Rides', 'Food', 'Mart'];

  // Mock comparison results
  const results = [
    { id: 1, type: 'Ride', platform: 'Uber Go', price: '₹150', time: '3 mins', rating: '4.8', tag: 'Cheapest' },
    { id: 2, type: 'Ride', platform: 'Ola Mini', price: '₹165', time: '2 mins', rating: '4.5', tag: 'Fastest' },
    { id: 3, type: 'Food', platform: 'Zomato', title: 'Burger King', price: '₹249', time: '35 mins', rating: '4.2', tag: 'Free Delivery' },
    { id: 4, type: 'Food', platform: 'Swiggy', title: 'Burger King', price: '₹260', time: '30 mins', rating: '4.3', tag: '' },
  ];

  const filteredResults = query 
    ? results.filter(r => r.platform.toLowerCase().includes(query.toLowerCase()) || r.title?.toLowerCase().includes(query.toLowerCase()) || r.type.toLowerCase().includes(query.toLowerCase()))
    : results;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('home')} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 py-2">
            <Search size={20} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              autoFocus
              placeholder="Search rides, food, groceries..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {query && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Comparison Results</h3>
            <button className="text-primary flex items-center gap-1 text-sm font-medium">
              <Filter size={14} /> Sort
            </button>
          </div>
        )}

        <div className="space-y-3">
          {filteredResults.map(result => (
            <GlassCard key={result.id} className="p-0 overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-lg">
                    {result.platform[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800">{result.title || result.platform}</h4>
                      {result.tag && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          {result.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{result.type === 'Food' ? result.platform : result.type}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {result.rating}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {result.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-lg font-bold text-gray-800">{result.price}</span>
                  <button className="mt-2 bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                    {result.type === 'Ride' ? 'Book' : 'Add'}
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
          
          {filteredResults.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <Search size={48} className="mx-auto mb-3 opacity-20" />
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
