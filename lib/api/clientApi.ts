import { Car, CarRequestParams, FilterParams } from "@/types/types";
import { carRentalApi } from "./api";

export interface CarApiResponse {
  cars: Car[];
  page: number;
  perPage: number;
  totalCars: number;
  totalPages: number;
}

export interface FilterMetadata {
  brands: string[];
  price: {
    min: number;
    max: number;
  };
}

export const getCars = async (
  page: number,
  filters: FilterParams,
): Promise<CarApiResponse> => {
  const params: Record<string, any> = {
    page,
    perPage: 12,
  };

  if (filters.brand && filters.brand !== "") {
    params.brand = filters.brand;
  }

  const res = await carRentalApi.get<CarApiResponse>("/cars", { params });

  return res.data;
};

export const getFilterMetadata = async (): Promise<FilterMetadata> => {
  const res = await carRentalApi.get<FilterMetadata>("/cars/filters");
  return res.data;
};

export const getCarById = async (carId: string): Promise<Car> => {
  const res = await carRentalApi.get<Car>(`/cars/${carId}`);
  return res.data;
};

export interface BookingData {
  name: string;
  email: string;
  comment: string;
}

export const createBookingRequest = async (
  carId: string,
  data: BookingData,
) => {
  const res = await carRentalApi.post(`/cars/${carId}/booking-requests`, data);
  return res.data;
};
