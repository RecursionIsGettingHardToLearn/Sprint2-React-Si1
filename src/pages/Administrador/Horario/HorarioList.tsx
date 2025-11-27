import React, { useEffect, useState } from 'react';
import { fetchHorarios, deleteHorario, type Horario } from '../../../api/api-horario';
import { fetchDisciplinas } from '../../../api/api-disciplina';
import type { Disciplina } from '../../../types/type-disciplina';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarAlt, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import HorarioForm from './HorarioForm';

const HorarioList: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<Horario | undefined>(undefined);
  
  // Filters
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [filterDia, setFilterDia] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [hData, dData] = await Promise.all([
        fetchHorarios(),
        fetchDisciplinas()
      ]);
      setHorarios(hData);
      setDisciplinas(dData);
    } catch (err) {
      setError(toUiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este horario?')) return;
    try {
      await deleteHorario(id);
      loadData();
    } catch (err) {
      alert('Error al eliminar horario');
    }
  };

  const handleEdit = (horario: Horario) => {
    setSelectedHorario(horario);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedHorario(undefined);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadData();
  };

  const filteredHorarios = horarios.filter(h => {
    const matchDisciplina = filterDisciplina ? h.disciplina.toString() === filterDisciplina : true;
    const matchDia = filterDia ? h.dia === filterDia : true;
    return matchDisciplina && matchDia;
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-green-600" />
            Gestión de Horarios
          </h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nuevo Horario
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Disciplina</label>
            <select
              value={filterDisciplina}
              onChange={(e) => setFilterDisciplina(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todas las disciplinas</option>
              {disciplinas.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Día</label>
            <select
              value={filterDia}
              onChange={(e) => setFilterDia(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos los días</option>
              {diasSemana.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disciplina</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sala</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Cargando datos...</td>
                  </tr>
                ) : filteredHorarios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No se encontraron horarios.</td>
                  </tr>
                ) : (
                  filteredHorarios.map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.dia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.hora_ini} - {h.hora_fin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{h.disciplina_nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">@{h.instructor_username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.sala_nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.cupo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(h)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => handleDelete(h.id)} className="text-red-600 hover:text-red-900">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <HorarioForm 
              horario={selectedHorario}
              onSuccess={handleFormSuccess} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HorarioList;
