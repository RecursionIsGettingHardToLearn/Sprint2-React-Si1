// src/components/Comprobantes.tsx
import React, { useEffect, useState } from 'react';
import axios from '../../../app/axiosInstance'; // Importar la instancia de axios configurada

const Comprobantes: React.FC = () => {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar los pagos
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const { data } = await axios.get('/pagos/mis_pagos/'); // Llamamos al endpoint para obtener los pagos
        setPagos(data);
      } catch (err) {
        setError('No se pudieron cargar los pagos. Intenta más tarde.');
        console.error('Error al cargar los pagos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Comprobantes de Pago</h1>
      <table>
        <thead>
          <tr>
            <th>Pago ID</th>
            <th>Tipo de Pago</th>
            <th>Monto</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id}>
              <td>{pago.id}</td>
              <td>{pago.tipo_pago}</td>
              <td>{pago.monto}</td>
              <td>
                {pago.comprobante_url ? (
                  <a href={pago.comprobante_url} target="_blank" rel="noopener noreferrer">
                    Ver Comprobante
                  </a>
                ) : (
                  'No disponible'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Comprobantes;
