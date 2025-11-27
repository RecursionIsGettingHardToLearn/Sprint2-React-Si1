import axiosInstance from '../app/axiosInstance';

export interface Sala {
  id: number;
  nombre: string;
  capacidad: number;
  descripcion?: string;
}

export const fetchSalas = async (): Promise<Sala[]> => {
  const response = await axiosInstance.get<Sala[]>('/salas/');
  return response.data;
};
