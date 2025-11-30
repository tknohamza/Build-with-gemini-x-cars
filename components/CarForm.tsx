import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { FuelType, Car } from '../types';
import Input from './Input';
import Select from './Select';
import Button from './Button';

interface CarFormProps {
  onAddCar: (car: Omit<Car, 'id' | 'addedAt'>) => void;
}

const CarForm: React.FC<CarFormProps> = ({ onAddCar }) => {
  const [brand, setBrand] = useState('');
  const [fuel, setFuel] = useState<FuelType>(FuelType.Diesel);
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!brand.trim() || !model.trim() || !price.trim()) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Veuillez entrer un prix valide (supérieur à 0)');
      return;
    }

    onAddCar({
      brand: brand.trim(),
      fuel,
      model: model.trim(),
      price: priceNum,
    });

    // Reset form
    setBrand('');
    setModel('');
    setPrice('');
    // Keep fuel as is or reset to default
  };

  const fuelOptions = Object.values(FuelType).map((t) => ({ value: t, label: t }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-6 text-indigo-700">
        <PlusCircle className="w-6 h-6" />
        <h2 className="text-xl font-bold">Ajouter une voiture</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Marque" 
            placeholder="Ex: Mercedes, Toyota..." 
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Input 
            label="Modèle" 
            placeholder="Ex: Classe C 2024" 
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            label="Carburant" 
            options={fuelOptions}
            value={fuel}
            onChange={(e) => setFuel(e.target.value as FuelType)}
          />
          <Input 
            label="Prix (DH)" 
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" className="w-full md:w-auto">
            Ajouter à la liste
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;