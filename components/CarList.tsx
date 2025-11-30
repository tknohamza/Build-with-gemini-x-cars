import React from 'react';
import { Car } from '../types';
import { Car as CarIcon, Trash2 } from 'lucide-react';
import Button from './Button';

interface CarListProps {
  cars: Car[];
  onRemoveCar: (id: string) => void;
}

const CarList: React.FC<CarListProps> = ({ cars, onRemoveCar }) => {
  if (cars.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center text-slate-400">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <CarIcon className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">Aucune voiture ajoutée</h3>
        <p className="text-sm mt-1">Utilisez le formulaire ci-dessus pour ajouter des véhicules.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CarIcon className="w-5 h-5 text-indigo-600" />
          Liste des voitures
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full ml-2">
            {cars.length}
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-semibold">Marque</th>
              <th className="px-6 py-4 font-semibold">Modèle</th>
              <th className="px-6 py-4 font-semibold">Carburant</th>
              <th className="px-6 py-4 font-semibold">Prix (DH)</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{car.brand}</td>
                <td className="px-6 py-4 text-slate-600">{car.model}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${car.fuel === 'Essence' ? 'bg-amber-100 text-amber-800' : 
                      car.fuel === 'Diesel' ? 'bg-slate-200 text-slate-700' :
                      car.fuel === 'Électrique' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'}`}>
                    {car.fuel}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600">
                  {new Intl.NumberFormat('fr-MA').format(car.price)}
                </td>
                <td className="px-6 py-4">
                  <Button 
                    variant="ghost" 
                    className="!p-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => onRemoveCar(car.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarList;