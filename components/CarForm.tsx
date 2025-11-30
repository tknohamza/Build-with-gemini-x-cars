import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X } from 'lucide-react';
import { FuelType, Car } from '../types';
import Input from './Input';
import Select from './Select';
import Button from './Button';

interface CarFormProps {
  onAddCar: (car: Omit<Car, 'id' | 'addedAt'>) => void;
  onUpdateCar: (car: Car) => void;
  editingCar: Car | null;
  onCancelEdit: () => void;
}

const CarForm: React.FC<CarFormProps> = ({ onAddCar, onUpdateCar, editingCar, onCancelEdit }) => {
  const [brand, setBrand] = useState('');
  const [fuel, setFuel] = useState<FuelType>(FuelType.Diesel);
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingCar) {
      setBrand(editingCar.brand);
      setFuel(editingCar.fuel as FuelType);
      setModel(editingCar.model);
      setPrice(editingCar.price.toString());
      setError(null);
    } else {
      setBrand('');
      setFuel(FuelType.Diesel);
      setModel('');
      setPrice('');
      setError(null);
    }
  }, [editingCar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!brand.trim() || !model.trim() || !price.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Veuillez saisir un prix valide (supérieur à 0)');
      return;
    }

    if (editingCar) {
      onUpdateCar({
        ...editingCar,
        brand: brand.trim(),
        fuel,
        model: model.trim(),
        price: priceNum,
      });
    } else {
      onAddCar({
        brand: brand.trim(),
        fuel,
        model: model.trim(),
        price: priceNum,
      });
      // Reset form only on add
      setBrand('');
      setModel('');
      setPrice('');
    }
  };

  const fuelOptions = Object.values(FuelType).map((t) => ({ value: t, label: t }));

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border h-full transition-colors duration-300 ${editingCar ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-100'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-indigo-700">
          {editingCar ? <Save className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
          <h2 className="text-xl font-bold">
            {editingCar ? 'Modifier la voiture' : 'Ajouter une voiture'}
          </h2>
        </div>
        {editingCar && (
          <button 
            onClick={onCancelEdit}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Annuler"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Marque" 
            placeholder="Ex: Peugeot, Renault..." 
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Input 
            label="Modèle" 
            placeholder="Ex: 208, Clio..." 
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
            label="Prix (MAD)" 
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

        <div className="pt-2 flex gap-3">
          <Button type="submit" className="flex-1 md:flex-none">
            {editingCar ? 'Enregistrer' : 'Ajouter à la liste'}
          </Button>
          
          {editingCar && (
            <Button type="button" variant="secondary" onClick={onCancelEdit} className="flex-1 md:flex-none">
              Annuler
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CarForm;