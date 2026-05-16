import * as Yup from "yup";

export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: number;
  engine: string;
  rentalPrice: string;
  rentalCompany: string;
  rentalConditions: string[];
  mileage: number;
  stockNumber: number;
  features: string[];
  location: {
    country: string;
    city: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FilterParams {
  brand?: string;
  rentalPrice?: string;
  minMileage?: number;
  maxMileage?: number;
}

export interface CarRequestParams {
  page: number;
  brand?: string;
  rentalPrice?: string;
  minMileage?: number;
  maxMileage?: number;
}

export const RentalSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Ім'я надто коротке")
    .required("Це поле є обов'язковим"),
  email: Yup.string()
    .email("Некоректний формат email")
    .required("Це поле є обов'язковим"),
  comment: Yup.string().max(500, "Коментар надто довгий"),
});
