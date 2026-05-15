export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engineSize: string;
  accessories: string[];
  functionalities: string[];
  rentalPrice: string;
  rentalCompany: string;
  address: string;
  rentalConditions: string;
  mileage: number;
}

export interface FilterParams {
  make?: string; // Замість brand
  rentalPrice?: string; // Максимальна ціна
  minMileage?: number; // Мінімальний пробіг
  maxMileage?: number; // Максимальний пробіг
}
