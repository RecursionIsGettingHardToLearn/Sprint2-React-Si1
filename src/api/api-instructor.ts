import axiosInstance from '../app/axiosInstance';
import type { Instructor } from '../types/type-instructor';

export const fetchInstructors = async (): Promise<Instructor[]> => {
  const response = await axiosInstance.get<Instructor[]>('/instructores/');
  return response.data;
};

export const fetchInstructor = async (id: number): Promise<Instructor> => {
  const response = await axiosInstance.get<Instructor>(`/instructores/${id}/`);
  return response.data;
};
