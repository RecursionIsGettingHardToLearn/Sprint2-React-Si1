import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSuscripciones, deleteSuscripcion } from '../../../api/api-suscripcion';
import type { Suscripcion } from '../../../types/type-suscripcion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const SuscripcionesList: React.FC = () => {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadSuscripciones = async () => {
    try {
      setLoading(true);
      const data = await fetchSuscripciones();
      setSuscripciones(data);
    } catch (error) {
      console.error('Error al cargar suscripciones', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuscripciones();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/administrador/suscripciones/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSuscripcion(id);
      loadSuscripciones();
    } catch (error) {
      console.error('Error al eliminar suscripción', error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">Suscripciones</h2>
        <button
          onClick={() => navigate('/administrador/suscripciones/new')}
          className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nueva Suscripción
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">Cargando suscripciones...</p>
        </div>
      ) : suscripciones.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">No hay suscripciones para mostrar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {suscripciones.map((suscripcion) => (
              <li key={suscripcion.id} className="p-4 sm:p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="text-xs font-semibold uppercase text-gray-500">ID: {suscripcion.id}</span>
                    <span className="text-xl font-semibold text-gray-900">{suscripcion.nombre}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(suscripcion.id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:block" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(suscripcion.id)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-2 hidden sm:block" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SuscripcionesList;
