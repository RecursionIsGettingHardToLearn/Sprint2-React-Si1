import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../../../app/axiosInstance';

const SuscripcionList: React.FC = () => {
    const [suscripciones, setSuscripciones] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingAccion, setLoadingAccion] = useState<number | null>(null);

    useEffect(() => {
        const loadSuscripciones = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/suscripciones');
                setSuscripciones(data.results || data);
            } catch (err) {
                setError('No se pudieron cargar las suscripciones. Intenta más tarde.');
                console.error('Error al cargar suscripciones:', err);
            } finally {
                setLoading(false);
            }
        };

        loadSuscripciones();
    }, []);

    const handlePagarConStripe = async (suscripcionId: number) => {
        setLoadingAccion(suscripcionId);
        try {
            const response = await api.post('/pagos/crear_sesion_stripe/', {
                tipo_objeto: 'suscripcion',
                objeto_id: suscripcionId,
                success_url: window.location.origin + '/cliente/suscripcion-pago-exitoso',
                cancel_url: window.location.origin + '/cliente/suscripcion-pago-cancelado',
            });

            const checkoutUrl = response.data.url;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
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

    const formatCurrency = (amount: string): string => {
        const num = parseFloat(amount);
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
        }).format(num);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-600 mb-4" />
                    <p className="text-gray-600">Cargando suscripciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg text-center">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Suscripciones</h1>

                {suscripciones.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600">No tienes suscripciones registradas.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {suscripciones.map((suscripcion) => (
                                        <tr key={suscripcion.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{suscripcion.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(suscripcion.precio)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{suscripcion.tipo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {suscripcion.estado_pago ? (
                                                    <span className="text-green-500">Suscripción Pagada</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePagarConStripe(suscripcion.id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
                                                        disabled={loadingAccion === suscripcion.id}
                                                    >
                                                        {loadingAccion === suscripcion.id ? (
                                                            <FontAwesomeIcon icon={faSpinner} spin />
                                                        ) : (
                                                            'Pagar Suscripción'
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default SuscripcionList