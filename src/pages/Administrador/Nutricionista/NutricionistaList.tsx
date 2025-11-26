import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNutricionistas } from '../../../api/api-nutricionista';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { type Nutricionista } from '../../../types/type-nutricionista';

const NutricionistaList: React.FC = () => {
  const [nutricionistas, setNutricionistas] = useState<Nutricionista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadNutricionistas = async () => {
      try {
        const data = await fetchNutricionistas();
        setNutricionistas(data);
      } catch (err) {
        const uiError = toUiError(err);
        setError(uiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadNutricionistas();
  }, []);

  const filteredNutricionistas = nutricionistas.filter(nutricionista =>
    (nutricionista.usuario_username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (nutricionista.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (nutricionista.apellido_paterno?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center text-gray-500">Cargando nutricionistas...</div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-lg">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nutricionistas</h1>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredNutricionistas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="mt-4 text-gray-500">
              {searchTerm ? 'No se encontraron nutricionistas que coincidan con la búsqueda.' : 'No hay nutricionistas registrados aún.'}
            </p>
          </div>
        )}

        {filteredNutricionistas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNutricionistas.map((nutricionista) => (
              <div
                key={nutricionista.usuario}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col relative"
              >
                <div className="absolute top-3 right-3 flex gap-1 z-10">
                  <Link
                    to={`/administrador/nutricionistas/${nutricionista.usuario}`}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Ver detalles"
                  >
                    <FontAwesomeIcon icon={faEye} size="sm" />
                  </Link>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-600 font-medium text-xs">
                    {(nutricionista.nombre?.charAt(0) || nutricionista.usuario_username?.charAt(0) || '?').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {nutricionista.nombre} {nutricionista.apellido_paterno}
                    </p>
                    <p className="text-xs text-gray-500 truncate">@{nutricionista.usuario_username}</p>
                  </div>
                </div>

                <div className="mb-3 space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <span className="font-medium mr-2">Horario:</span>
                    {nutricionista.horario_atencion || 'No definido'}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <span className="font-medium mr-2">Titulación:</span>
                    {nutricionista.fecha_titulacion || 'No registrada'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutricionistaList;
