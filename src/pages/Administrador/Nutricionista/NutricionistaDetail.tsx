import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNutricionista } from '../../../api/api-nutricionista';
import { fetchAntecedentes, type Antecedente } from '../../../api/api-antecedente';
import { toUiError } from '../../../api/error';
import { type Nutricionista } from '../../../types/type-nutricionista';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserMd, faFileMedical, faCalendarAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import AntecedenteForm from './AntecedenteForm';

const NutricionistaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [nutricionista, setNutricionista] = useState<Nutricionista | null>(null);
  const [antecedentes, setAntecedentes] = useState<Antecedente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [nutriData, antData] = await Promise.all([
        fetchNutricionista(+id),
        fetchAntecedentes({ nutricionista: id })
      ]);
      
      setNutricionista(nutriData);
      setAntecedentes(antData);
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFormSuccess = () => {
    setShowForm(false);
    loadData(); // Reload data to show new antecedent
  };

  if (loading && !nutricionista) return <div className="p-6 text-center text-gray-500">Cargando detalles...</div>;
  if (error && !nutricionista) return <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-lg">{error}</div>;
  if (!nutricionista) return <div className="p-6 text-center text-gray-500">Nutricionista no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <AntecedenteForm 
              nutricionistaId={Number(id)} 
              onSuccess={handleFormSuccess} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/administrador/nutricionistas')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver a la lista
        </button>

        {/* Header Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(nutricionista.nombre?.charAt(0) || nutricionista.usuario_username?.charAt(0) || '?').toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {nutricionista.nombre} {nutricionista.apellido_paterno}
              </h1>
              <p className="text-gray-500">@{nutricionista.usuario_username}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faUserMd} className="mr-2 text-green-500" />
                  Nutricionista
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                  Horario: {nutricionista.horario_atencion || 'No definido'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Antecedentes Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <FontAwesomeIcon icon={faFileMedical} className="mr-2 text-green-600" />
                Antecedentes Registrados
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Registrar Antecedente
              </button>
            </div>

            {antecedentes.length === 0 ? (
              <p className="text-gray-500 text-sm">No ha registrado antecedentes aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {antecedentes.map((ant) => (
                      <tr key={ant.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ant.fecha}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ant.diagnostico}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ant.peso}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ant.imc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutricionistaDetail;
