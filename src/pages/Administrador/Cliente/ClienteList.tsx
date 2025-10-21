import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchClients, deleteClient } from '../../../api/api-cliente';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { type CustomClientResponse } from '../../../types/type-cliente';
import { useNavigate } from 'react-router-dom';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<CustomClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        console.log(data); // Verifica qué datos se reciben
        setClients(data);
      } catch (err) {
        const uiError = toUiError(err);
        setError(uiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleDelete = async (usuario: number) => {
    if (!usuario) {
      console.error("Usuario no encontrado");
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')) return;

    try {
      await deleteClient(usuario);  // Usar 'usuario' en lugar de 'id'
      setClients((prevClients) => prevClients.filter(client => client.usuario !== usuario)); // Usar 'usuario' en lugar de 'id'
      navigate('/administrador/clientes');
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message);
    } finally {
      setConfirmingDelete(null);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Cargando clientes...</div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-lg">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <Link
            to="/administrador/clientes/nuevo"
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            Crear Cliente
          </Link>
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="mt-4 text-gray-500">No hay clientes registrados aún.</p>
          </div>
        )}

        {clients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.usuario} // Usar 'usuario' como key
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col relative"
              >
                <div className="absolute top-3 right-3 flex gap-1 z-10">
                  <Link
                    to={`/administrador/clientes/${client.usuario}/editar`} // Usar 'usuario' en lugar de 'id'
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Editar cliente"
                  >
                    <FontAwesomeIcon icon={faEdit} size="sm" />
                  </Link>
                  <button
                    onClick={() => setConfirmingDelete(client.usuario)} // Usar 'usuario' en lugar de 'id'
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Eliminar cliente"
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </button>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-xs">
                    {client.usuario_username.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {client.usuario_username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{client.email}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {client.suscripcion_actual_nombre ?? 'Sin suscripción'}
                  </span>
                </div>

                {confirmingDelete === client.usuario && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                    <p className="text-red-800 mb-2">¿Eliminar este cliente?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(client.usuario)} // Usar 'usuario' en lugar de 'id'
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        onClick={() => setConfirmingDelete(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
