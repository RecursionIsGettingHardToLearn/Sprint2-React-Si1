import React, { useEffect, useState } from 'react';
import { fetchDisciplinas } from '../../../api/api-disciplina';
import { fetchInstructors } from '../../../api/api-instructor';
import type { Disciplina } from '../../../types/type-disciplina';
import type { Instructor } from '../../../types/type-instructor';
import { fetchSalas, type Sala } from '../../../api/api-sala';
import { createHorario, updateHorario, type Horario } from '../../../api/api-horario';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface HorarioFormProps {
  horario?: Horario;
  onSuccess: () => void;
  onCancel: () => void;
}

const HorarioForm: React.FC<HorarioFormProps> = ({ horario, onSuccess, onCancel }) => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [instructores, setInstructores] = useState<Instructor[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  
  const [formData, setFormData] = useState({
    disciplina: horario?.disciplina || 0,
    instructor: horario?.instructor || 0,
    sala: horario?.sala || 0,
    dia: horario?.dia || 'Lunes',
    hora_ini: horario?.hora_ini || '',
    hora_fin: horario?.hora_fin || '',
    cupo: horario?.cupo || 20,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [dData, iData, sData] = await Promise.all([
          fetchDisciplinas(),
          fetchInstructors(),
          fetchSalas()
        ]);
        setDisciplinas(dData);
        setInstructores(iData);
        setSalas(sData);
      } catch (err) {
        setError('Error al cargar opciones');
      }
    };
    loadOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (horario) {
        await updateHorario(horario.id, formData);
      } else {
        await createHorario(formData as any);
      }
      onSuccess();
    } catch (err) {
      setError(toUiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-green-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">
          {horario ? 'Editar Horario' : 'Nuevo Horario'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Disciplina */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
            <select
              name="disciplina"
              value={formData.disciplina}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value={0}>Seleccione una disciplina</option>
              {disciplinas.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <select
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value={0}>Seleccione un instructor</option>
              {instructores.map(i => (
                <option key={i.usuario} value={i.usuario}>
                  {i.nombre} {i.apellido_paterno}
                </option>
              ))}
            </select>
          </div>

          {/* Sala */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sala</label>
            <select
              name="sala"
              value={formData.sala}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value={0}>Seleccione una sala</option>
              {salas.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          {/* Día */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
            <select
              name="dia"
              value={formData.dia}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            >
              {diasSemana.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>

          {/* Hora Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
            <input
              type="time"
              name="hora_ini"
              value={formData.hora_ini}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Hora Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
            <input
              type="time"
              name="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Cupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cupo</label>
            <input
              type="number"
              name="cupo"
              value={formData.cupo}
              onChange={handleChange}
              min="1"
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? 'Guardando...' : 'Guardar Horario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HorarioForm;
