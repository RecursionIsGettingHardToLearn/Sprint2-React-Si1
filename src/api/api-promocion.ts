import axios from '../app/axiosInstance';
import type { Promocion } from '../types/type-promocion';

export interface PromocionDto {
  nombre: string;
  tipo: string;
  estado: boolean;
  descripcion: string;
  descuento: number;
  fecha_ini: string;
  fecha_fin: string;
}

export const fetchPromociones = async (): Promise<Promocion[]> => {
  const { data } = await axios.get<Promocion[]>('/promociones/');
  return data;
};

export const fetchPromocion = async (id: number): Promise<Promocion> => {
  const { data } = await axios.get<Promocion>(`/promociones/${id}/`);
  return data;
};

export const createPromocion = async (promocion: PromocionDto): Promise<Promocion> => {
  const { data } = await axios.post<Promocion>('/promociones/', promocion);
  return data;
};

export const updatePromocion = async (id: number, promocion: PromocionDto): Promise<Promocion> => {
  const { data } = await axios.put<Promocion>(`/promociones/${id}/`, promocion);
  return data;
};

export const deletePromocion = async (id: number): Promise<void> => {
  await axios.delete(`/promociones/${id}/`);
};
