import axiosInstance from '../app/axiosInstance';
import type { Nutricionista } from '../types/type-nutricionista';

export const fetchNutricionistas = async (): Promise<Nutricionista[]> => {
  const response = await axiosInstance.get<Nutricionista[]>('/nutricionistas/');
  return response.data;
};

export const fetchNutricionista = async (id: number): Promise<Nutricionista> => {
  const response = await axiosInstance.get<Nutricionista>(`/nutricionistas/${id}/`);
  return response.data;
};
