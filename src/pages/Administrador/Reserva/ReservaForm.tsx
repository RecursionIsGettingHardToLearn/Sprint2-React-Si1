import React, { useEffect, useState } from 'react';
import { fetchClients } from '../../../api/api-cliente';
import type { CustomClientResponse } from '../../../types/type-cliente';
import { fetchHorarios, type Horario } from '../../../api/api-horario';
import { createReserva } from '../../../api/api-reserva';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ReservaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ReservaForm: React.FC<ReservaFormProps> = ({ onSuccess, onCancel }) => {
  const [clientes, setClientes] = useState<CustomClientResponse[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  
  const [formData, setFormData] = useState({
    cliente: 0,
    horario: 0,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [cData, hData] = await Promise.all([
          fetchClients(),
          fetchHorarios()
        ]);
        setClientes(cData);
        // Solo mostrar horarios con cupos disponibles
        setHorarios(hData.filter((h: Horario) => h.cupo > 0));
      } catch (err) {
        setError('Error al cargar opciones');
      }
    };
    loadOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    
    if (name === 'horario') {
      const horario = horarios.find(h => h.id === parseInt(value));
      setSelectedHorario(horario || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createReserva(formData);
      onSuccess();
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Nueva Reserva</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente <span className="text-red-500">*</span>
            </label>
            <select
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={0}>Seleccione un cliente</option>
              {clientes.map(c => (
                <option key={c.usuario} value={c.usuario}>
                  {c.nombre} {c.apellido_paterno} (@{c.usuario_username})
                </option>
              ))}
            </select>
          </div>

          {/* Horario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horario <span className="text-red-500">*</span>
            </label>
            <select
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={0}>Seleccione un horario</option>
              {horarios.map(h => (
                <option key={h.id} value={h.id}>
                  {h.disciplina_nombre} - {h.dia} {h.hora_ini} ({h.cupo} cupos disponibles)
                </option>
              ))}
            </select>
          </div>

          {/* Información del horario seleccionado */}
          {selectedHorario && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Detalles del Horario</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Disciplina:</span> {selectedHorario.disciplina_nombre}
                </div>
                <div>
                  <span className="font-medium">Día:</span> {selectedHorario.dia}
                </div>
                <div>
                  <span className="font-medium">Hora:</span> {selectedHorario.hora_ini} - {selectedHorario.hora_fin}
                </div>
                <div>
                  <span className="font-medium">Sala:</span> {selectedHorario.sala_nombre}
                </div>
                <div>
                  <span className="font-medium">Instructor:</span> @{selectedHorario.instructor_username}
                </div>
                <div>
                  <span className="font-medium text-green-600">Cupos disponibles:</span> {selectedHorario.cupo}
                </div>
              </div>
            </div>
          )}

          {horarios.length === 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800">
              No hay horarios con cupos disponibles en este momento.
            </div>
          )}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
            disabled={loading || formData.cliente === 0 || formData.horario === 0}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? 'Guardando...' : 'Crear Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservaForm;
