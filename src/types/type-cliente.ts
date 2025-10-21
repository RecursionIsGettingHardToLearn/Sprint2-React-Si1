export interface CustomClientResponse {
  id: number;
  usuario: number;
  usuario_username: string;
  email: string;
  suscripcion_actual_nombre: string;
  fecha_ini_mem: string;
  fecha_fin_mem: string;
}

export interface ClienteFormState {
  usuario: string;
  suscripcion_actual: string;
  fecha_ini_mem: string;
  fecha_fin_mem: string;
}
