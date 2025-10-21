import axiosInstance from '../app/axiosInstance';
import { type CustomClientResponse, type ClienteFormState } from '../types/type-cliente';

// Fetch all clients
export const fetchClients = async (): Promise<CustomClientResponse[]> => {
  const response = await axiosInstance.get<CustomClientResponse[]>('/clientes/');
  return response.data;
};

// Fetch single client by 'usuario' (instead of 'id')
export const fetchClient = async (usuario: number): Promise<CustomClientResponse> => {
  const response = await axiosInstance.get<CustomClientResponse>(`/clientes/${usuario}/`);
  return response.data;
};

// Create a new client
export const createClient = async (payload: ClienteFormState): Promise<CustomClientResponse> => {
  const response = await axiosInstance.post<CustomClientResponse>('/clientes/', payload);
  return response.data;
};

// Update existing client using 'usuario' as identifier
export const updateClient = async (usuario: number, payload: ClienteFormState): Promise<CustomClientResponse> => {
  const response = await axiosInstance.put<CustomClientResponse>(`/clientes/${usuario}/`, payload);
  return response.data;
};

// Delete client using 'usuario' as identifier (instead of 'id')
export const deleteClient = async (usuario: number): Promise<void> => {
  await axiosInstance.delete(`/clientes/${usuario}/`);
};
