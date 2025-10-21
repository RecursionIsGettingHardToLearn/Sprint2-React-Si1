import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import axiosInstance from '../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserCircle } from '@fortawesome/free-solid-svg-icons';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: string | null;
  direccion: string | null;
  fecha_nacimiento: string | null; // 'YYYY-MM-DD'
  rol:  string | null;
}

// Función para obtener el perfil completo del usuario
async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const { data } = await axiosInstance.get<UserProfile>('/usuarios/me/');
    return data;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return null;
  }
}

// Función para obtener la suscripción actual del usuario desde la API de clientes
async function fetchUserSubscription(userId: number): Promise<any> {
  try {
    const { data } = await axiosInstance.get(`/clientes/${userId}/`);
    return data;
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    return null;
  }
}

export default function Perfil() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSubscription, setUserSubscription] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const roleToChangePasswordPath: Record<string, string> = {
    Administrador: '/administrador/cambiar-contra',
    Propietario: '/propietario/cambiar-contra',
  };

  const changePasswordPath = roleToChangePasswordPath[user?.rol || ''] || '/cambiar-contra';

  useEffect(() => {
    if (user?.id && !userProfile) {
      setProfileLoading(true);
      fetchUserProfile()
        .then(data => {
          setUserProfile(data);
          setProfileLoading(false);
        })
        .catch(() => {
          setProfileLoading(false);
        });
    } else if (!user?.id) {
      setProfileLoading(false);
    }

    // Obtener la suscripción si el usuario tiene un ID
    if (user?.id) {
      fetchUserSubscription(user.id)
        .then(data => {
          setUserSubscription(data);
        })
        .catch(() => {
          console.error("Error al obtener la suscripción.");
        });
    }
  }, [user, userProfile]);

  // Estado de carga combinado
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-gray-700 text-lg">Cargando perfil...</p>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-100">
        <p className="mb-6 text-gray-700 text-xl font-medium">No hay una sesión activa.</p>
        <NavLink
          to="/login"
          className="px-6 py-3 text-base font-semibold text-white transition-all duration-300 rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Iniciar sesión
        </NavLink>
      </div>
    );
  }

  // 👇 Usamos userProfile si está disponible, sino user (con campos opcionales, no habrá error)
  const displayUser = userProfile || user;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl">
        <button
          onClick={() => navigate('/cliente/dashboard')}
          className="flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 transition-colors duration-200 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-base" />
          Atrás
        </button>

        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col items-center mb-8">
            <FontAwesomeIcon icon={faUserCircle} className="text-blue-600 text-7xl mb-4" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-center">
              {displayUser.nombre} {displayUser.apellido_paterno}
            </h1>
            <p className="text-base font-medium text-gray-500 mt-2">{displayUser.rol}</p>
          </div>

          {/* Mostrar la suscripción actual */}
          {userSubscription && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-5 sm:p-6 border border-gray-200">
                <h2 className="font-semibold text-xl text-gray-800 mb-4 border-b pb-2">Suscripción Actual</h2>
                <dl className="space-y-4 text-sm sm:text-base">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <dt className="text-gray-600 font-medium w-1/3">Suscripción:</dt>
                    <dd className="font-semibold text-gray-900 w-2/3 break-words text-right">
                      {userSubscription.suscripcion_actual_nombre}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <dt className="text-gray-600 font-medium w-1/3">Fecha de Inicio:</dt>
                    <dd className="font-semibold text-gray-900 w-2/3 text-right">
                      {new Date(userSubscription.fecha_ini_mem!).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <dt className="text-gray-600 font-medium w-1/3">Fecha de Expiración:</dt>
                    <dd className="font-semibold text-gray-900 w-2/3 text-right">
                      {new Date(userSubscription.fecha_fin_mem!).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-5 sm:p-6 border border-gray-200">
              <h2 className="font-semibold text-xl text-gray-800 mb-4 border-b pb-2">Información Personal</h2>
              <dl className="space-y-4 text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <dt className="text-gray-600 font-medium w-1/3">ID de Usuario:</dt>
                  <dd className="font-semibold text-gray-900 w-2/3 break-words text-right">{displayUser.id}</dd>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <dt className="text-gray-600 font-medium w-1/3">Nombre de Usuario:</dt>
                  <dd className="font-semibold text-gray-900 w-2/3 break-words text-right">{displayUser.username}</dd>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <dt className="text-gray-600 font-medium w-1/3">Nombre Completo:</dt>
                  <dd className="font-semibold text-gray-900 w-2/3 break-words text-right">
                    {displayUser.nombre} {displayUser.apellido_paterno} {displayUser.apellido_materno}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <dt className="text-gray-600 font-medium w-1/3">Email:</dt>
                  <dd className="font-semibold text-blue-600 w-2/3 break-words text-right">{displayUser.email}</dd>
                </div>
              </dl>
            </div>

            <NavLink
              to={changePasswordPath}
              className="flex justify-center items-center w-full px-6 py-3 text-base font-semibold text-white transition-all duration-300 rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Cambiar contraseña
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
