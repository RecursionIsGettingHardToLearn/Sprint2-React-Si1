import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInstructor } from '../../../api/api-instructor';
import { fetchDisciplinas } from '../../../api/api-disciplina';
import { fetchHorarios, type Horario } from '../../../api/api-horario';
import { toUiError } from '../../../api/error';
import { type Instructor } from '../../../types/type-instructor';
import { type Disciplina } from '../../../types/type-disciplina';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChalkboardTeacher, faClock, faDumbbell } from '@fortawesome/free-solid-svg-icons';

const InstructorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [instData, discData, horData] = await Promise.all([
          fetchInstructor(+id),
          fetchDisciplinas({ instructor: id }),
          fetchHorarios({ instructor: id })
        ]);
        
        setInstructor(instData);
        setDisciplinas(discData);
        setHorarios(horData);
      } catch (err) {
        const uiError = toUiError(err);
        setError(uiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-500">Cargando detalles...</div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-lg">{error}</div>;
  if (!instructor) return <div className="p-6 text-center text-gray-500">Instructor no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/administrador/instructores')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver a la lista
        </button>

        {/* Header Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(instructor.nombre?.charAt(0) || instructor.usuario_username?.charAt(0) || '?').toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {instructor.nombre} {instructor.apellido_paterno}
              </h1>
              <p className="text-gray-500">@{instructor.usuario_username}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2 text-slate-500" />
                  {instructor.especialidad}
                </span>
                <span className="flex items-center">
                  <span className="font-medium mr-1">Ingreso:</span>
                  {instructor.fecha_ingreso}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disciplinas Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faDumbbell} className="mr-2 text-slate-700" />
              Disciplinas Asignadas
            </h2>
            {disciplinas.length === 0 ? (
              <p className="text-gray-500 text-sm">No tiene disciplinas asignadas.</p>
            ) : (
              <ul className="space-y-3">
                {disciplinas.map(d => (
                  <li key={d.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-900">{d.nombre}</p>
                    <p className="text-xs text-gray-500">{d.grupo || 'Sin grupo'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Horarios Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-slate-700" />
              Horarios Asignados
            </h2>
            {horarios.length === 0 ? (
              <p className="text-gray-500 text-sm">No tiene horarios asignados.</p>
            ) : (
              <ul className="space-y-3">
                {horarios.map(h => (
                  <li key={h.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{h.disciplina_nombre}</p>
                      <p className="text-xs text-gray-500">{h.sala_nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{h.dia}</p>
                      <p className="text-xs text-gray-500">{h.hora_ini.slice(0, 5)} - {h.hora_fin.slice(0, 5)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetail;
