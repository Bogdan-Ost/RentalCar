import { Car, FilterParams } from "@/types/types";
import axios from "axios";

export const carRentalApi = axios.create({
  baseURL: "https://car-rental-api.goit.global",
});

export interface ApiResponse {
  cars: Car[]; // Описуємо структуру відповіді з Swagger
}

export const getCars = async (page: number, filters: any): Promise<Car[]> => {
  const res = await carRentalApi.get<ApiResponse>("/cars", {
    params: {
      page,
      limit: 12,
      brand: filters.brand,
      rentalPrice: filters.rentalPrice,
      minMileage: filters.minMileage,
      maxMileage: filters.maxMileage,
    },
  });

  return res.data.cars || [];
};
