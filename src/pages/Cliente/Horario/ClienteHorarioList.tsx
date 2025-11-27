import React, { useEffect, useState } from 'react';
import { fetchHorarios, type Horario } from '../../../api/api-horario';
import { fetchDisciplinas } from '../../../api/api-disciplina';
import type { Disciplina } from '../../../types/type-disciplina';
import { createReserva } from '../../../api/api-reserva';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCheck, faClock, faUsers, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const ClienteHorarioList: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [filterDia, setFilterDia] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [hData, dData] = await Promise.all([
        fetchHorarios(),
        fetchDisciplinas()
      ]);
      // Solo mostrar horarios con cupos disponibles
      setHorarios(hData.filter((h: Horario) => h.cupo > 0));
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

  const handleReservar = async (horarioId: number) => {
    if (!window.confirm('¿Deseas reservar este horario?')) return;
    
    try {
      // El backend obtendrá el cliente del usuario autenticado
      await createReserva({ 
        cliente: 0, // Se llenará en el backend con el usuario actual
        horario: horarioId 
      });
      alert('¡Reserva creada exitosamente!');
      loadData(); // Recargar para actualizar cupos
    } catch (err: any) {
      const error = toUiError(err);
      
      // Intentar obtener el mensaje específico del backend
      let errorMessage = 'Error al crear reserva';
      
      if (err.response?.data) {
        const data = err.response.data;
        
        // Si hay un mensaje de error específico para el horario
        if (data.horario) {
          errorMessage = Array.isArray(data.horario) ? data.horario[0] : data.horario;
        } 
        // Si hay un mensaje general
        else if (data.detail) {
          errorMessage = data.detail;
        }
        // Si hay un non_field_errors
        else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        }
        // Si hay otros mensajes de error
        else if (typeof data === 'object' && Object.keys(data).length > 0) {
          const firstKey = Object.keys(data)[0];
          const firstError = data[firstKey];
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
        }
      }
      
      alert(errorMessage);
    }
  };

  const filteredHorarios = horarios.filter(h => {
    const matchDisciplina = filterDisciplina ? h.disciplina === parseInt(filterDisciplina) : true;
    const matchDia = filterDia ? h.dia === filterDia : true;
    return matchDisciplina && matchDia && h.cupo > 0;
  });

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-blue-600" />
            Horarios Disponibles
          </h1>
          <p className="text-gray-600 mt-2">Reserva tu clase favorita</p>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Disciplina</label>
            <select
              value={filterDisciplina}
              onChange={(e) => setFilterDisciplina(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las disciplinas</option>
              {disciplinas.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Día</label>
            <select
              value={filterDia}
              onChange={(e) => setFilterDia(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los días</option>
              {dias.map(dia => (
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

        {/* Grid de Horarios */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando horarios...</p>
          </div>
        ) : filteredHorarios.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No hay horarios disponibles con cupos en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHorarios.map((h) => (
              <div key={h.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <h3 className="text-xl font-bold text-white">{h.disciplina_nombre}</h3>
                  <p className="text-blue-100 text-sm">{h.dia}</p>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                    <span className="font-medium">{h.hora_ini} - {h.hora_fin}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500" />
                    <span>{h.sala_nombre}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
                    <span>
                      <span className="font-semibold text-green-600">{h.cupo}</span> cupos disponibles
                    </span>
                  </div>
                  
                  <div className="pt-3">
                    <button
                      onClick={() => handleReservar(h.id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold shadow-sm"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Reservar Ahora
                    </button>
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

export default ClienteHorarioList;
