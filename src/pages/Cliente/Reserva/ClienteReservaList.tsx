import React, { useEffect, useState } from 'react';
import { fetchReservas, updateReserva, type Reserva } from '../../../api/api-reserva';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faBan, faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';

const ClienteReservaList: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtro por estado
  const [filterEstado, setFilterEstado] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchReservas();
      // El backend debería filtrar solo las reservas del cliente actual
      // Si no lo hace, deberíamos filtrarlo aquí
      setReservas(data);
    } catch (err) {
      setError(toUiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;
    
    try {
      await updateReserva(id, { estado: 'Cancelada' });
      alert('Reserva cancelada exitosamente');
      loadData();
    } catch (err: any) {
      console.error('Error al cancelar:', err);
      
      let errorMessage = 'Error al cancelar reserva';
      
      if (err.response?.data) {
        const data = err.response.data;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          const firstError = Object.values(data)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
        }
      }
      
      alert(errorMessage);
    }
  };

  const filteredReservas = reservas.filter(r => {
    const matchEstado = filterEstado ? r.estado === filterEstado : true;
    return matchEstado;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faCalendarCheck} className="mr-3 text-blue-600" />
            Mis Reservas
          </h1>
          <p className="text-gray-600 mt-2">Gestiona tus clases reservadas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Estado</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full md:w-64 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Lista de Reservas */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando tus reservas...</p>
          </div>
        ) : filteredReservas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No tienes reservas {filterEstado ? `en estado ${filterEstado}` : ''}.</p>
            <p className="text-gray-400 mt-2">¡Ve a horarios disponibles para hacer una reserva!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservas.map((r) => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className={`p-4 ${
                  r.estado === 'Confirmada' ? 'bg-green-50 border-b-4 border-green-500' :
                  r.estado === 'Cancelada' ? 'bg-red-50 border-b-4 border-red-500' :
                  'bg-yellow-50 border-b-4 border-yellow-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{r.horario_disciplina_nombre}</h3>
                      <p className="text-gray-600">{r.horario_dia}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                      r.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {r.estado === 'Confirmada' && <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />}
                      {r.estado === 'Cancelada' && <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />}
                      {r.estado === 'Pendiente' && <FontAwesomeIcon icon={faClock} className="mr-1" />}
                      {r.estado}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 block">Hora:</span>
                      <span className="font-medium text-gray-900">{r.horario_hora_ini}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Fecha Reserva:</span>
                      <span className="font-medium text-gray-900">{r.fecha}</span>
                    </div>
                  </div>
                  
                  {r.estado !== 'Cancelada' && (
                    <div className="pt-3 border-t">
                      <button
                        onClick={() => handleCancelar(r.id)}
                        className="w-full py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center font-medium"
                      >
                        <FontAwesomeIcon icon={faBan} className="mr-2" />
                        Cancelar Reserva
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClienteReservaList;
