import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { fetchPromociones } from '../../../api/api-promocion';
import type { Promocion } from '../../../types/type-promocion';
import api from '../../../app/axiosInstance'; // Asegúrate de importar tu instancia de axios para hacer la solicitud API

const PromocionList: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAccion, setLoadingAccion] = useState<number | null>(null);
//  const navigate = useNavigate();

  useEffect(() => {
    const loadPromociones = async () => {
      setLoading(true);
      try {
        const data = await fetchPromociones();
        setPromociones(data);
      } catch (error) {
        console.error('Error al cargar promociones', error);
      } finally {
        setLoading(false);
      }
    };
    loadPromociones();
  }, []);

  const handlePagarConStripe = async (promocionId: number) => {
    setLoadingAccion(promocionId);
    try {
      // Realizamos una solicitud para crear la sesión de pago con Stripe para la promoción
      const response = await api.post('/pagos/crear_sesion_stripe/', {
        tipo_objeto: 'promocion',
        objeto_id: promocionId,
        success_url: window.location.origin + '/cliente/promocion-pago-exitoso',
        cancel_url: window.location.origin + '/cliente/promocion-pago-cancelado',
      });

      const checkoutUrl = response.data.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Redirige a Stripe Checkout
      } else {
        console.error('No se recibió la URL de Stripe Checkout');
        alert('Error al iniciar el pago. Intenta de nuevo.');
      }
    } catch (err: any) {
      console.error('Error al procesar el pago con Stripe:', err.response ? err.response.data : err.message);
      alert('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoadingAccion(null);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">Promociones</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">Cargando promociones...</p>
        </div>
      ) : promociones.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">No hay promociones disponibles.</p>
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
                    <span className="text-sm text-gray-500">Descuento: {promocion.descuento}%</span>
                    <span className="text-sm text-gray-500">Fecha Inicio: {promocion.fecha_ini}</span>
                    <span className="text-sm text-gray-500">Fecha Fin: {promocion.fecha_fin}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePagarConStripe(promocion.id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition duration-300"
                      disabled={loadingAccion === promocion.id}
                    >
                      {loadingAccion === promocion.id ? (
                        <span>Procesando...</span>
                      ) : (
                        'Pagar Promoción'
                      )}
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
