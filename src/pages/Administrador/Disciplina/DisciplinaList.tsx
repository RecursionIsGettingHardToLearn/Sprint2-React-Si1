import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDisciplinas, deleteDisciplina } from '../../../api/api-disciplina';
import type { Disciplina } from '../../../types/type-disciplina';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const DisciplinasList: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadDisciplinas = async () => {
    try {
      setLoading(true);
      const data = await fetchDisciplinas();
      setDisciplinas(data);
    } catch (error) {
      console.error('Error al cargar disciplinas', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/administrador/disciplinas/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta disciplina?')) {
      try {
        await deleteDisciplina(id);
        loadDisciplinas();
      } catch (error) {
        console.error('Error al eliminar disciplina', error);
        alert('Error al eliminar la disciplina');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">Disciplinas</h2>
        <button
          onClick={() => navigate('/administrador/disciplinas/new')}
          className="flex items-center px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-slate-900 transition duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nueva Disciplina
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">Cargando disciplinas...</p>
        </div>
      ) : disciplinas.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">No hay disciplinas para mostrar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sala
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disciplinas.map((disciplina) => (
                  <tr key={disciplina.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {disciplina.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{disciplina.nombre}</div>
                      {disciplina.descripcion && (
                        <div className="text-sm text-gray-500">{disciplina.descripcion}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                        {disciplina.grupo || 'Sin grupo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {disciplina.cupo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {disciplina.sala_nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {disciplina.instructor_nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(disciplina.id)}
                          className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition duration-300"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(disciplina.id)}
                          className="flex items-center px-3 py-1 bg-red-50 text-red-600 text-xs rounded hover:bg-red-100 transition duration-300"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinasList;
