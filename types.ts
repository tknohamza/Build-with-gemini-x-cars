export enum FuelType {
  Petrol = 'Essence',
  Diesel = 'Diesel',
  Electric = 'Électrique',
  Hybrid = 'Hybride'
}

export interface Car {
  id: string;
  brand: string;
  fuel: FuelType | string;
  model: string;
  price: number;
  addedAt: Date;
}