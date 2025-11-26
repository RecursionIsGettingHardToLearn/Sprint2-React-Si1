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
}

export const fetchAntecedentes = async (params?: any): Promise<Antecedente[]> => {
  const response = await axiosInstance.get<Antecedente[]>('/antecedentes/', { params });
  return response.data;
};
