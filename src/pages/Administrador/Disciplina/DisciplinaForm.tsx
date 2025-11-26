import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDisciplina, createDisciplina, updateDisciplina } from '../../../api/api-disciplina';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toUiError } from '../../../api/error';
import axios from '../../../app/axiosInstance';

// Tipos para Sala e Instructor
interface Sala {
  id: number;
  nombre: string;
}

interface Instructor {
  usuario: number;
  usuario_username: string;
}

const DisciplinaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  const [salas, setSalas] = useState<Sala[]>([]);
  const [instructores, setInstructores] = useState<Instructor[]>([]);

  // Define el tipo de los valores del formulario
  type FormValues = {
    nombre: string;
    grupo: string;
    descripcion: string;
    cupo: number;
    sala: number | '';
    instructor: number | '';
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { nombre: '', grupo: '', descripcion: '', cupo: 1, sala: '', instructor: '' },
  });

  // Cargar salas e instructores
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [salasRes, instructoresRes] = await Promise.all([
          axios.get<Sala[]>('/salas/'),
          axios.get<Instructor[]>('/instructores/'),
        ]);
        setSalas(salasRes.data);
        setInstructores(instructoresRes.data);
      } catch (error) {
        console.error('Error al cargar opciones', error);
      }
    };
    loadOptions();
  }, []);

  // Cargar disciplina si es edición
  useEffect(() => {
    const loadDisciplina = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const disciplina = await fetchDisciplina(Number(id));
        reset({
          nombre: disciplina?.nombre ?? '',
          grupo: disciplina?.grupo ?? '',
          descripcion: disciplina?.descripcion ?? '',
          cupo: disciplina?.cupo ?? 1,
          sala: disciplina?.sala ?? '',
          instructor: disciplina?.instructor ?? '',
        });
      } catch (err) {
        setTopError('No se pudo cargar la disciplina.');
      } finally {
        setLoading(false);
      }
    };
    loadDisciplina();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: FormValues) => {
    // Validación personalizada
    const cupo = parseInt(values.cupo.toString());
    if (!values.nombre || values.nombre.trim() === '') {
      setTopError('El nombre es obligatorio.');
      return;
    }
    if (isNaN(cupo) || cupo <= 0) {
      setTopError('El cupo debe ser un número válido y mayor que 0.');
      return;
    }

    // Convertir valores vacíos a undefined para campos opcionales
    const payload = {
      ...values,
      cupo,
      sala: values.sala === '' ? undefined : Number(values.sala),
      instructor: values.instructor === '' ? undefined : Number(values.instructor),
    };

    setTopError('');
    try {
      if (isEdit && id) {
        await updateDisciplina(Number(id), payload);
      } else {
        await createDisciplina(payload);
      }
      navigate('/administrador/disciplinas');
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
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Disciplina' : 'Nueva Disciplina'}</h2>
          <button
            onClick={() => navigate('/administrador/disciplinas')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Volver a la lista de disciplinas"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  id="nombre"
                  type="text"
                  {...register('nombre')}
                  placeholder="Ej. CrossFit"
                  aria-invalid={!!errors.nombre}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.nombre && (
                  <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>

              {/* Grupo */}
              <div>
                <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo
                </label>
                <input
                  id="grupo"
                  type="text"
                  {...register('grupo')}
                  placeholder="Ej. Funcional, Cardio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Cupo */}
              <div>
                <label htmlFor="cupo" className="block text-sm font-medium text-gray-700 mb-1">
                  Cupo *
                </label>
                <input
                  id="cupo"
                  type="number"
                  {...register('cupo')}
                  placeholder="Ej. 25"
                  min="1"
                  aria-invalid={!!errors.cupo}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.cupo && (
                  <p className="mt-2 text-sm text-red-600">{errors.cupo.message}</p>
                )}
              </div>

              {/* Sala */}
              <div>
                <label htmlFor="sala" className="block text-sm font-medium text-gray-700 mb-1">
                  Sala
                </label>
                <select
                  id="sala"
                  {...register('sala')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {salas.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                      {sala.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor */}
              <div className="md:col-span-2">
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor
                </label>
                <select
                  id="instructor"
                  {...register('instructor')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {instructores.map((instructor) => (
                    <option key={instructor.usuario} value={instructor.usuario}>
                      {instructor.usuario_username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                {...register('descripcion')}
                placeholder="Descripción de la disciplina"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/disciplinas')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'}`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DisciplinaForm;
