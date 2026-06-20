import React from 'react';
import { ArrowLeft, Search, Calendar, Users, MapPin, Star } from 'lucide-react';
import { HOTELS } from '../constants';
import { ProviderBadge } from '../components/ProviderBadge';

interface HotelsViewProps {
  onBack: () => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="font-bold text-xl text-gray-800">Hotels & Stays</h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Destination</p>
                <input type="text" placeholder="City, hotel, or area" className="w-full outline-none font-medium text-gray-800" />
              </div>
            </div>
            <div className="flex items-center border-b border-gray-100 pb-3">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1 flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Check-in</p>
                  <p className="font-medium text-gray-800">Today</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Check-out</p>
                  <p className="font-medium text-gray-800">Tomorrow</p>
                </div>
              </div>
            </div>
            <div className="flex items-center pb-1">
              <Users className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Guests & Rooms</p>
                <p className="font-medium text-gray-800">2 Guests, 1 Room</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-brand-600 text-white rounded-xl font-bold active:bg-brand-700 transition-colors">
            Compare Prices
          </button>
        </div>

        {/* Aggregated Hotels List */}
        <h2 className="font-bold text-lg text-gray-800 mb-4">Best Deals Found</h2>
        <div className="space-y-4 pb-24">
          {HOTELS.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <div className="relative h-40">
                <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center text-xs font-bold text-gray-800 shadow-sm">
                  <Star className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" /> {hotel.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{hotel.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1" /> {hotel.location}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Available on</p>
                    <ProviderBadge provider={hotel.provider} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 line-through">₹{hotel.originalPrice}</p>
                    <p className="font-bold text-xl text-brand-600">₹{hotel.price} <span className="text-xs text-gray-500 font-normal">/night</span></p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2.5 bg-gray-50 text-brand-600 font-bold rounded-xl border border-brand-100 active:bg-brand-50 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
