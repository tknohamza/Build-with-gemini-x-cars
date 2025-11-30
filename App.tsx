import React, { useState } from 'react';
import { Car } from './types';
import CarForm from './components/CarForm';
import CarList from './components/CarList';
import AvailabilitySearch from './components/AvailabilitySearch';
import { Car as CarIcon } from 'lucide-react';

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleAddCar = (newCarData: Omit<Car, 'id' | 'addedAt'>) => {
    const newCar: Car = {
      ...newCarData,
      id: crypto.randomUUID(),
      addedAt: new Date(),
    };
    setCars((prev) => [...prev, newCar]);
  };

  const handleUpdateCar = (updatedCar: Car) => {
    setCars((prev) => prev.map((car) => (car.id === updatedCar.id ? updatedCar : car)));
    setEditingCar(null);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    // Smooth scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCar(null);
  };

  const handleRemoveCar = (id: string) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
    if (editingCar?.id === id) {
      setEditingCar(null);
    }
  };

  const handleImportCars = (importedCars: Car[]) => {
    setCars((prev) => [...prev, ...importedCars]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
              <CarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestion de Parc Auto</h1>
              <p className="text-xs text-slate-500 font-medium">Système d'inventaire intelligent</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
             Total : <span className="font-bold text-indigo-600">{cars.length} véhicules</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Section: Form and Search side by side */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CarForm 
            onAddCar={handleAddCar} 
            onUpdateCar={handleUpdateCar}
            editingCar={editingCar}
            onCancelEdit={handleCancelEdit}
          />
          <AvailabilitySearch cars={cars} />
        </section>

        {/* Bottom Section: List View */}
        <section>
          <CarList 
            cars={cars} 
            onRemoveCar={handleRemoveCar} 
            onEditCar={handleEditCar}
            onImportCars={handleImportCars}
          />
        </section>

      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 mt-auto py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Gestion de Parc Automobile. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default App;