import { z } from 'zod';

export const suscripcionSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
  tipo: z.string().optional(),
  descripcion: z.string().optional(),
  precio: z.number().min(0.01, { message: 'El precio debe ser mayor que 0' }),
});

export type FormState = z.infer<typeof suscripcionSchema>;
