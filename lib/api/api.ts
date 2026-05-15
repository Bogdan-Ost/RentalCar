import axios, { type AxiosInstance } from "axios";

export const nextServer: AxiosInstance = axios.create({
  baseURL: "https://car-rental-api.goit.global",
});
