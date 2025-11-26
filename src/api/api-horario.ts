import axiosInstance from '../app/axiosInstance';

export interface Horario {
  id: number;
  disciplina: number;
  disciplina_nombre?: string;
  sala: number;
  sala_nombre?: string;
  instructor: number;
  instructor_username?: string;
  dia: string;
  hora_ini: string;
  hora_fin: string;
  cupo: number;
}

export const fetchHorarios = async (params?: any): Promise<Horario[]> => {
  const response = await axiosInstance.get<Horario[]>('/horarios/', { params });
  return response.data;
};
