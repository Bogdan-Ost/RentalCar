import axios, { type AxiosInstance } from "axios";

export const carRentalApi = axios.create({
  baseURL: "https://car-rental-api.goit.study",
});
