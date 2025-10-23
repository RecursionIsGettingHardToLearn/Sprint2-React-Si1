import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchPromocion, createPromocion, updatePromocion } from '../../../api/api-promocion';
import { toUiError } from '../../../api/error';

const PromocionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');

  // Definimos el tipo de los valores del formulario manualmente
  type FormValues = {
    nombre: string;
    tipo: string;
    estado: boolean;
    descripcion: string;
    descuento: number;
    fecha_ini: string;
    fecha_fin: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      nombre: '',
      tipo: '',
      estado: true,
      descripcion: '',
      descuento: 0,
      fecha_ini: '',
      fecha_fin: '',
    },
  });

  useEffect(() => {
    const loadPromocion = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const promocionData = await fetchPromocion(Number(id)); // Ahora asignamos el resultado a promocionData directamente
        reset({
          nombre: promocionData.nombre,
          tipo: promocionData.tipo,
          estado: promocionData.estado,
          descripcion: promocionData.descripcion,
          descuento: promocionData.descuento,
          fecha_ini: promocionData.fecha_ini,
          fecha_fin: promocionData.fecha_fin,
        });
      } catch (err) {
        setTopError('No se pudo cargar la promoción.');
      } finally {
        setLoading(false);
      }
    };
    loadPromocion();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: FormValues) => {
    setTopError('');

    // Validación personalizada
    if (!values.nombre.trim()) {
      setTopError('El nombre es obligatorio.');
      return;
    }
    if (!values.tipo.trim()) {
      setTopError('El tipo es obligatorio.');
      return;
    }
    if (!values.descripcion.trim()) {
      setTopError('La descripción es obligatoria.');
      return;
    }
    if (values.descuento < 0 || values.descuento > 100) {
      setTopError('El descuento debe estar entre 0 y 100.');
      return;
    }
    if (!values.fecha_ini || isNaN(Date.parse(values.fecha_ini))) {
      setTopError('La fecha de inicio no es válida.');
      return;
    }
    if (!values.fecha_fin || isNaN(Date.parse(values.fecha_fin))) {
      setTopError('La fecha de fin no es válida.');
      return;
    }

    try {
      if (isEdit && id) {
        await updatePromocion(Number(id), values);
      } else {
        await createPromocion(values);
      }
      navigate('/administrador/promociones');
    } catch (error) {
      const ui = toUiError(error);
      if (ui.message) setTopError(ui.message);

      if (ui.fields) {
        (Object.keys(ui.fields) as (keyof FormValues)[]).forEach((field) => {
          const msgs = ui.fields?.[field as string];
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs ?? '');
          if (field in values) {
            setError(field, { type: 'server', message });
          } else {
            if (message) setTopError((prev) => (prev ? `${prev} ${message}` : message));
          }
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Promoción' : 'Nueva Promoción'}</h2>
          <button
            onClick={() => navigate('/administrador/promociones')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Volver a la lista de promociones"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {topError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
            {topError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <p className="text-gray-600">Cargando datos…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                {...register('nombre')}
                placeholder="Ej. Promoción de Navidad"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'nombre-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nombre && (
                <p id="nombre-err" className="mt-2 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Promoción
              </label>
              <input
                id="tipo"
                type="text"
                {...register('tipo')}
                placeholder="Ej. Descuento, 2x1"
                aria-invalid={!!errors.tipo}
                aria-describedby={errors.tipo ? 'tipo-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.tipo && (
                <p id="tipo-err" className="mt-2 text-sm text-red-600">
                  {errors.tipo.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                {...register('descripcion')}
                placeholder="Descripción breve de la promoción"
                aria-invalid={!!errors.descripcion}
                aria-describedby={errors.descripcion ? 'descripcion-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.descripcion && (
                <p id="descripcion-err" className="mt-2 text-sm text-red-600">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="descuento" className="block text-sm font-medium text-gray-700 mb-1">
                Descuento
              </label>
              <input
                id="descuento"
                type="number"
                {...register('descuento')}
                placeholder="Ej. 10"
                aria-invalid={!!errors.descuento}
                aria-describedby={errors.descuento ? 'descuento-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.descuento && (
                <p id="descuento-err" className="mt-2 text-sm text-red-600">
                  {errors.descuento.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fecha_ini" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  id="fecha_ini"
                  type="date"
                  {...register('fecha_ini')}
                  aria-invalid={!!errors.fecha_ini}
                  aria-describedby={errors.fecha_ini ? 'fecha_ini-err' : undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.fecha_ini && (
                  <p id="fecha_ini-err" className="mt-2 text-sm text-red-600">
                    {errors.fecha_ini.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  id="fecha_fin"
                  type="date"
                  {...register('fecha_fin')}
                  aria-invalid={!!errors.fecha_fin}
                  aria-describedby={errors.fecha_fin ? 'fecha_fin-err' : undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.fecha_fin && (
                  <p id="fecha_fin-err" className="mt-2 text-sm text-red-600">
                    {errors.fecha_fin.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/promociones')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>

            {isDirty && (
              <p className="text-sm text-center text-gray-500 mt-4">Tienes cambios sin guardar.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PromocionForm;
