import axios from '../app/axiosInstance';
import type { Disciplina } from '../types/type-disciplina';

export interface DisciplinaDto {
  nombre: string;
  grupo?: string;
  descripcion?: string;
  cupo: number;
  sala?: number;
  instructor?: number;
}

export const fetchDisciplinas = async (params?: any): Promise<Disciplina[]> => {
  const { data } = await axios.get<Disciplina[]>('/disciplinas/', { params });
  return data;
};

export const fetchDisciplina = async (id: number): Promise<Disciplina> => {
  const { data } = await axios.get<Disciplina>(`/disciplinas/${id}/`);
  return data;
};

export const createDisciplina = async (d: DisciplinaDto): Promise<Disciplina> => {
  const { data } = await axios.post<Disciplina>('/disciplinas/', d);
  return data;
};

export const updateDisciplina = async (id: number, d: DisciplinaDto): Promise<Disciplina> => {
  const { data } = await axios.put<Disciplina>(`/disciplinas/${id}/`, d);
  return data;
};

export const deleteDisciplina = async (id: number): Promise<void> => {
  await axios.delete(`/disciplinas/${id}/`);
};

// Endpoint especial para instructores
export const fetchMisDisciplinas = async (): Promise<{count: number, instructor: string, disciplinas: Disciplina[]}> => {
  const { data} = await axios.get('/disciplinas/mis-disciplinas/');
  return data;
};
