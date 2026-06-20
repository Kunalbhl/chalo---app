import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Package, Truck, Info } from 'lucide-react';
import { DELIVERY_VEHICLES } from '../constants';
import { getVehicleIcon } from '../components/Icons';

interface SendViewProps {
  onBack: () => void;
}

export const SendView: React.FC<SendViewProps> = ({ onBack }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="font-bold text-xl text-gray-800">Send Packages</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Form */}
        <div className="bg-white p-4 shadow-sm mb-4">
          <div className="relative pl-8 mb-2">
            <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
            <div className="mb-4 relative">
              <div className="absolute -left-8 top-3 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
              <input 
                type="text" 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                placeholder="Sender's location"
              />
            </div>
            <div className="relative">
              <div className="absolute -left-8 top-3 w-2 h-2 rounded-sm bg-brand-600 ring-4 ring-brand-50"></div>
              <input 
                type="text" 
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                placeholder="Receiver's location"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="p-4">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Select Vehicle</h2>
          <div className="space-y-3">
            {DELIVERY_VEHICLES.map((vehicle) => (
              <button
                key={vehicle.id}
                className="w-full flex items-center p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-brand-500 active:bg-gray-50 transition-all text-left"
              >
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center mr-4 bg-gray-50 rounded-xl">
                  {getVehicleIcon(vehicle.iconType, "w-10 h-10 text-gray-700")}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{vehicle.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{vehicle.description}</p>
                  <div className="flex items-center mt-2 text-xs font-medium text-brand-600">
                    <Clock className="w-3 h-3 mr-1" /> {vehicle.eta} min away
                  </div>
                </div>
                <div className="text-right pl-2">
                  <p className="font-bold text-lg text-gray-800">₹{vehicle.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="px-4 pb-24">
          <div className="bg-blue-50 rounded-xl p-4 flex gap-3 border border-blue-100">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Please ensure items are packed securely. Illegal items, cash, and hazardous materials are strictly prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white p-4 border-t border-gray-100 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg active:bg-brand-700 transition-colors">
          Review Order
        </button>
      </div>
    </div>
  );
};
