import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Car, FuelType } from '../types';
import Input from './Input';
import Select from './Select';
import Button from './Button';

interface AvailabilitySearchProps {
  cars: Car[];
}

const AvailabilitySearch: React.FC<AvailabilitySearchProps> = ({ cars }) => {
  const [searchBrand, setSearchBrand] = useState('');
  const [searchFuel, setSearchFuel] = useState<FuelType | ''>('');
  const [result, setResult] = useState<'found' | 'not-found' | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBrand || !searchFuel) return;

    const found = cars.some(car => 
      car.brand.toLowerCase() === searchBrand.toLowerCase() && 
      car.fuel === searchFuel
    );

    setResult(found ? 'found' : 'not-found');
  };

  const resetSearch = () => {
    setSearchBrand('');
    setSearchFuel('');
    setResult(null);
  };

  const fuelOptions = [
    { value: '', label: 'Choisir le carburant...' },
    ...Object.values(FuelType).map((t) => ({ value: t, label: t }))
  ];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6 text-indigo-300">
          <Search className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Vérifier la disponibilité</h2>
        </div>
        
        <p className="text-slate-400 mb-6 text-sm">
          Recherchez dans le stock pour vérifier la disponibilité d'un véhicule spécifique par marque et carburant.
        </p>

        {result === null ? (
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-300">Marque</label>
                <input
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Ex: BMW"
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-300">Carburant</label>
                <select
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                  value={searchFuel}
                  onChange={(e) => setSearchFuel(e.target.value as FuelType)}
                >
                  {fuelOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit"
                disabled={!searchBrand || !searchFuel}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/50"
              >
                Rechercher
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
            {result === 'found' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Disponible !</h3>
                <p className="text-green-300 mb-4">La voiture que vous recherchez est disponible en stock.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
                  <XCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Non disponible</h3>
                <p className="text-red-300 mb-4">Désolé, aucun véhicule ne correspond à ces critères.</p>
              </div>
            )}
            
            <button 
              onClick={resetSearch}
              className="mt-4 inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Nouvelle recherche
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySearch;