import axios from '../app/axiosInstance';
import type { Suscripcion } from '../types/type-suscripcion';

export interface SuscripcionDto {
  nombre: string;
  tipo?: string;
  descripcion?: string;
  precio: number;
}

export const fetchSuscripciones = async (): Promise<Suscripcion[]> => {
  const { data } = await axios.get<Suscripcion[]>('/suscripciones/');
  return data;
};

export const fetchSuscripcion = async (id: number): Promise<Suscripcion> => {
  const { data } = await axios.get<Suscripcion>(`/suscripciones/${id}/`);
  return data;
};

export const createSuscripcion = async (s: SuscripcionDto): Promise<Suscripcion> => {
  const { data } = await axios.post<Suscripcion>('/suscripciones/', s);
  return data;
};

export const updateSuscripcion = async (id: number, s: SuscripcionDto): Promise<Suscripcion> => {
  const { data } = await axios.put<Suscripcion>(`/suscripciones/${id}/`, s);
  return data;
};

export const deleteSuscripcion = async (id: number): Promise<void> => {
  await axios.delete(`/suscripciones/${id}/`);
};
