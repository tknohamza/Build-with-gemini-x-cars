import React, { useRef, useMemo } from 'react';
import { Car, FuelType } from '../types';
import { Car as CarIcon, Trash2, Pencil, Download, Upload, Droplets, Zap, Leaf, Fuel } from 'lucide-react';
import Button from './Button';

interface CarListProps {
  cars: Car[];
  onRemoveCar: (id: string) => void;
  onEditCar: (car: Car) => void;
  onImportCars: (cars: Car[]) => void;
}

const CarList: React.FC<CarListProps> = ({ cars, onRemoveCar, onEditCar, onImportCars }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const counts = {
      total: cars.length,
      [FuelType.Diesel]: 0,
      [FuelType.Petrol]: 0,
      [FuelType.Electric]: 0,
      [FuelType.Hybrid]: 0,
      other: 0
    };

    cars.forEach(car => {
      const fuel = car.fuel as FuelType;
      if (counts.hasOwnProperty(fuel)) {
        counts[fuel]++;
      } else {
        counts.other++;
      }
    });

    return counts;
  }, [cars]);

  const handleExport = () => {
    if (cars.length === 0) return;

    // Define CSV headers
    const headers = ["Marque", "Modèle", "Carburant", "Prix", "Date d'ajout"];
    
    // Convert cars data to CSV rows
    const csvContent = [
      headers.join(','),
      ...cars.map(car => [
        `"${car.brand.replace(/"/g, '""')}"`,
        `"${car.model.replace(/"/g, '""')}"`,
        `"${car.fuel}"`,
        car.price,
        `"${new Date(car.addedAt).toLocaleDateString('fr-FR')}"`
      ].join(','))
    ].join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `voitures_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentVal = '';
    let inQuote = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i+1];
      
      if (char === '"') {
        if (inQuote && nextChar === '"') {
          currentVal += '"';
          i++; 
        } else {
          inQuote = !inQuote;
        }
      } else if (char === ',' && !inQuote) {
        currentRow.push(currentVal);
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuote) {
        if (currentRow.length > 0 || currentVal) {
          currentRow.push(currentVal);
          rows.push(currentRow);
        }
        currentRow = [];
        currentVal = '';
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        currentVal += char;
      }
    }
    if (currentRow.length > 0 || currentVal) {
      currentRow.push(currentVal);
      rows.push(currentRow);
    }
    return rows;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) return;
      
      try {
        const rows = parseCSV(content);
        // Remove header
        if (rows.length > 0) rows.shift();
        
        const importedCars: Car[] = [];
        
        rows.forEach(row => {
          if (row.length < 4) return;
          
          const brand = row[0]?.trim();
          const model = row[1]?.trim();
          const fuel = row[2]?.trim();
          const price = parseFloat(row[3]);
          const dateStr = row[4]; // Optional
          
          if (brand && model && !isNaN(price)) {
            // Validate fuel against FuelType or keep string
            let validFuel = fuel;
            
            importedCars.push({
              id: crypto.randomUUID(),
              brand,
              model,
              fuel: validFuel,
              price,
              addedAt: dateStr ? new Date(dateStr) : new Date()
            });
          }
        });

        if (importedCars.length > 0) {
          onImportCars(importedCars);
        } else {
          alert("Aucune voiture valide trouvée dans le fichier.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la lecture du fichier CSV.");
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const getFuelColor = (fuel: string) => {
    if (fuel === FuelType.Petrol) return 'bg-amber-100 text-amber-800';
    if (fuel === FuelType.Diesel) return 'bg-slate-200 text-slate-700';
    if (fuel === FuelType.Electric) return 'bg-emerald-100 text-emerald-800';
    if (fuel === FuelType.Hybrid) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  }

  if (cars.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center text-slate-400">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv" 
          className="hidden" 
        />
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <CarIcon className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">Aucune voiture ajoutée</h3>
        <p className="text-sm mt-1 mb-6">Utilisez le formulaire ci-dessus pour ajouter des véhicules ou importez une liste.</p>
        <Button 
          variant="secondary" 
          onClick={handleImportClick}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Importer CSV
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv" 
          className="hidden" 
        />
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CarIcon className="w-5 h-5 text-indigo-600" />
            Liste des voitures
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleImportClick} 
              className="text-sm py-2 px-3 flex items-center gap-2"
              title="Importer CSV"
            >
              <Upload className="w-4 h-4" />
              Importer
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleExport} 
              className="text-sm py-2 px-3 flex items-center gap-2"
              title="Exporter CSV"
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistics Dashboard placed inside the card under the title */}
        <div className="bg-slate-50 border-b border-slate-100 p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-indigo-600 text-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{stats.total}</span>
              <span className="text-xs opacity-90 mt-1">Total voitures</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-700">
              <div className="flex items-center gap-2 mb-1 text-slate-500">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-medium">{FuelType.Diesel}</span>
              </div>
              <span className="text-lg font-bold">{stats[FuelType.Diesel]}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-700">
              <div className="flex items-center gap-2 mb-1 text-slate-500">
                <Fuel className="w-4 h-4" />
                <span className="text-xs font-medium">{FuelType.Petrol}</span>
              </div>
              <span className="text-lg font-bold">{stats[FuelType.Petrol]}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-700">
              <div className="flex items-center gap-2 mb-1 text-slate-500">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium">{FuelType.Electric}</span>
              </div>
              <span className="text-lg font-bold">{stats[FuelType.Electric]}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-700">
              <div className="flex items-center gap-2 mb-1 text-slate-500">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-medium">{FuelType.Hybrid}</span>
              </div>
              <span className="text-lg font-bold">{stats[FuelType.Hybrid]}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold text-start">Marque</th>
                <th className="px-6 py-4 font-semibold text-start">Modèle</th>
                <th className="px-6 py-4 font-semibold text-start">Carburant</th>
                <th className="px-6 py-4 font-semibold text-start">Prix (MAD)</th>
                <th className="px-6 py-4 font-semibold text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{car.brand}</td>
                  <td className="px-6 py-4 text-slate-600">{car.model}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1.5 ${getFuelColor(car.fuel)}`}>
                      {car.fuel}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    {new Intl.NumberFormat('fr-MA').format(car.price)}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      className="!p-2 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => onEditCar(car)}
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
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
    </div>
  );
};

export default CarList;