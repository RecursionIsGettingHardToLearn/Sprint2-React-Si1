import { z } from "zod";

// Definimos el esquema para la validación del formulario de promociones
export const promocionSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  tipo: z.string().min(1, "El tipo es obligataorio").trim(),
  estado: z.boolean(),
  descripcion: z.string().max(100, "La descripción no puede superar los 500 caracteres"),
  descuento: z
    .number()
    .min(0, "El descuento no puede ser menor que 0")
    .max(100, "El descuento no puede ser mayor que 100"),
  fecha_ini: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha de inicio no es válida",
  }),
  fecha_fin: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha de fin no es válida",
  }),
});

// Tipo para los datos del formulario
export type FormState = z.infer<typeof promocionSchema>;
