import React, { useEffect, useState } from 'react';
import { fetchAntecedentes, type Antecedente } from '../../../api/api-antecedente';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import AntecedenteForm from '../Nutricionista/AntecedenteForm';

const AntecedenteList: React.FC = () => {
  const [antecedentes, setAntecedentes] = useState<Antecedente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAntecedentes();
      setAntecedentes(data);
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    loadData();
  };

  const filteredAntecedentes = antecedentes.filter(ant => {
    const search = searchTerm.toLowerCase();
    const clienteName = `${ant.cliente_nombre || ''} ${ant.cliente_apellido || ''} ${ant.cliente_username || ''}`.toLowerCase();
    const diagnostico = ant.diagnostico?.toLowerCase() || '';
    
    return clienteName.includes(search) || diagnostico.includes(search);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faFileMedical} className="mr-3 text-green-600" />
            Gestión de Antecedentes Clínicos
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nuevo Antecedente
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por cliente (nombre, usuario) o diagnóstico..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutricionista</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMC</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Cargando datos...</td>
                  </tr>
                ) : filteredAntecedentes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No se encontraron antecedentes.</td>
                  </tr>
                ) : (
                  filteredAntecedentes.map((ant) => (
                    <tr key={ant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ant.fecha}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ant.cliente_nombre} {ant.cliente_apellido}
                        <span className="text-gray-500 text-xs block">@{ant.cliente_username}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {ant.nutricionista_nombre} {ant.nutricionista_apellido}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ant.diagnostico}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ant.imc}</td>
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
            <AntecedenteForm 
              onSuccess={handleFormSuccess} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AntecedenteList;
