export interface Disciplina {
  id: number;
  nombre: string;
  grupo?: string;
  descripcion?: string;
  cupo: number;
  sala?: number;
  sala_nombre?: string;
  instructor?: number;
  instructor_nombre?: string;
}
