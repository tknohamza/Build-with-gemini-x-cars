import React, { useState } from 'react';
import { Car } from './types';
import CarForm from './components/CarForm';
import CarList from './components/CarList';
import AvailabilitySearch from './components/AvailabilitySearch';
import { LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  // Initialize with some sample data just to make the UI look good initially,
  // essentially mimicking the state after the user has input some data in the python script.
  const [cars, setCars] = useState<Car[]>([]);

  const handleAddCar = (newCarData: Omit<Car, 'id' | 'addedAt'>) => {
    const newCar: Car = {
      ...newCarData,
      id: crypto.randomUUID(),
      addedAt: new Date(),
    };
    setCars((prev) => [...prev, newCar]);
  };

  const handleRemoveCar = (id: string) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestion Auto</h1>
              <p className="text-xs text-slate-500 font-medium">Système de gestion numérique</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
             Total voitures : <span className="font-bold text-indigo-600">{cars.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Section 1: Input (Saisie) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
             {/* List View */}
             <CarList cars={cars} onRemoveCar={handleRemoveCar} />
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* Form */}
            <CarForm onAddCar={handleAddCar} />
            
            {/* Search (Recherche) - Mimicking Python logic separate section */}
            <AvailabilitySearch cars={cars} />
          </div>
        </section>

      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 mt-auto py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Système de Gestion Auto. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default App;