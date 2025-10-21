import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPromociones, deletePromocion } from '../../../api/api-promocion';
import type { Promocion } from '../../../types/type-promocion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const PromocionList: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadPromociones = async () => {
    try {
      setLoading(true);
      const data = await fetchPromociones();
      setPromociones(data);
    } catch (error) {
      console.error('Error al cargar promociones', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromociones();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/administrador/promociones/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePromocion(id);
      loadPromociones();
    } catch (error) {
      console.error('Error al eliminar promoción', error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">Promociones</h2>
        <button
          onClick={() => navigate('/administrador/promociones/new')}
          className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nueva Promoción
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">Cargando promociones...</p>
        </div>
      ) : promociones.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">No hay promociones para mostrar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {promociones.map((promocion) => (
              <li key={promocion.id} className="p-4 sm:p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="text-xs font-semibold uppercase text-gray-500">ID: {promocion.id}</span>
                    <span className="text-xl font-semibold text-gray-900">{promocion.nombre}</span>
                    <span className="text-sm text-gray-500">Tipo: {promocion.tipo}</span>
                    <span className="text-sm text-gray-500">Descuento: {promocion.descuento}%</span>
                    <span className="text-sm text-gray-500">Fecha Inicio: {promocion.fecha_ini}</span>
                    <span className="text-sm text-gray-500">Fecha Fin: {promocion.fecha_fin}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(promocion.id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:block" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(promocion.id)}
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

export default PromocionList;
