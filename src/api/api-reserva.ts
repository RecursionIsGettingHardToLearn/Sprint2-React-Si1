import axiosInstance from '../app/axiosInstance';

export interface Reserva {
  id: number;
  cliente: number;
  horario: number;
  fecha: string;
  estado: string;
  cliente_username?: string;
  horario_disciplina_nombre?: string;
  horario_dia?: string;
  horario_hora_ini?: string;
  horario_sala_nombre?: string;
  horario_cupo?: number;
}

export const fetchReservas = async (params?: any): Promise<Reserva[]> => {
  const response = await axiosInstance.get<Reserva[]>('/reservas/', { params });
  return response.data;
};

export const createReserva = async (data: {cliente: number, horario: number}): Promise<Reserva> => {
  const response = await axiosInstance.post<Reserva>('/reservas/', data);
  return response.data;
};

export const updateReserva = async (id: number, data: Partial<Reserva>): Promise<Reserva> => {
  const response = await axiosInstance.patch<Reserva>(`/reservas/${id}/`, data);
  return response.data;
};

export const deleteReserva = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/reservas/${id}/`);
};
