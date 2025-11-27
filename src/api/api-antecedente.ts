import axiosInstance from '../app/axiosInstance';

export interface Antecedente {
  id: number;
  cliente: number;
  nutricionista: number;
  fecha: string;
  diagnostico: string;
  recomendaciones: string;
  peso: number;
  altura: number;
  imc: number;
  gc: number;
  cc: number;
  fecha_prox_consulta: string;
  cliente_username?: string;
  cliente_nombre?: string;
  cliente_apellido?: string;
  nutricionista_username?: string;
  nutricionista_nombre?: string;
  nutricionista_apellido?: string;
}

export const fetchAntecedentes = async (params?: any): Promise<Antecedente[]> => {
  const response = await axiosInstance.get<Antecedente[]>('/antecedentes/', { params });
  return response.data;
};

export const createAntecedente = async (data: Partial<Antecedente>): Promise<Antecedente> => {
  const response = await axiosInstance.post<Antecedente>('/antecedentes/', data);
  return response.data;
};
