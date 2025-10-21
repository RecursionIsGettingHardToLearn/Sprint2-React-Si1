import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const SuscripcionCancelado: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/cliente/suscripciones'); // Redirige a la lista de suscripciones
        }, 5000); // Redirige después de 5 segundos

        return () => clearTimeout(timer); // Limpiar el temporizador
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
            <FontAwesomeIcon icon={faTimesCircle} size="5x" className="text-red-500 mb-6 animate-shake" />
            <h1 className="text-3xl font-bold text-red-800 mb-4">Pago Cancelado</h1>
            <p className="text-lg text-red-700 text-center">
                Has cancelado el proceso de pago.
            </p>
            <p className="text-md text-red-600 mt-2">
                Puedes intentar de nuevo en cualquier momento.
            </p>
        </div>
    );
};

export default SuscripcionCancelado;
