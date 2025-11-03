import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';

type EstadoSuscripcion = 'activa' | 'cancelada' | 'expirada' | 'pausada';
type TipoCancel = 'inmediata' | 'al_fin';

interface SuscripcionClienteDTO {
  id: number;
  estado: EstadoSuscripcion;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado_pago: boolean;
  fecha_pago?: string | null;
  estado_cancelacion?: boolean;
  fecha_cancelacion?: string | null;
  cliente_username?: string;
  suscripcion_nombre?: string;
  suscripcion?: { nombre?: string; precio?: string };
}

const Vitas: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');
  const [susActiva, setSusActiva] = useState<SuscripcionClienteDTO | null>(null);
  const [tipo, setTipo] = useState<TipoCancel>('inmediata');
  const [motivo, setMotivo] = useState('');
  const [cancelando, setCancelando] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setTopError('');
    try {
      const { data: sus } = await axiosInstance.get<SuscripcionClienteDTO[]>('/suscripciones-clientes', { params: { mine: 1 } });
      const actual = (sus || []).sort((a, b) => (a.fecha_inicio > b.fecha_inicio ? -1 : 1))[0] || null;
      setSusActiva(actual);
    } catch (err) {
      const uiError = toUiError(err);
      setTopError(uiError.message || 'No se pudo cargar tu suscripción');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const planNombre = useMemo(() => {
    if (!susActiva) return '—';
    return susActiva.suscripcion_nombre || susActiva.suscripcion?.nombre || 'Plan';
  }, [susActiva]);

  const estadoBadge = (estado?: EstadoSuscripcion) => {
    if (!estado) return null;
    const base = 'px-2 py-1 rounded text-white text-xs font-medium';
    if (estado === 'activa') return <span className={`${base} bg-green-600`}>Activa</span>;
    if (estado === 'pausada') return <span className={`${base} bg-yellow-600`}>Pausada</span>;
    if (estado === 'cancelada') return <span className={`${base} bg-red-600`}>Cancelada</span>;
    if (estado === 'expirada') return <span className={`${base} bg-gray-500`}>Expirada</span>;
    return <span className={`${base} bg-gray-400`}>{estado}</span>;
  };

  const cancelar = async () => {
    if (!susActiva || cancelando) return;
    
    const tipoTexto = tipo === 'inmediata' ? 'inmediata (corte hoy)' : 'al final del período';
    const confirmar = window.confirm(
      `¿Confirmas solicitar la cancelación ${tipoTexto} del plan "${planNombre}"?${motivo ? `\n\nMotivo: ${motivo}` : ''}`
    );
    
    if (!confirmar) return;

    setCancelando(true);
    try {
      await axiosInstance.post(`/suscripciones-clientes/${susActiva.id}/cancelar/`, {
        tipo_cancelacion: tipo,
        motivo: motivo
      });
      toast.success('La suscripción ha sido cancelada exitosamente');
      setMotivo('');
      await loadData();
    } catch (err) {
      const uiError = toUiError(err);
      toast.error(uiError.message || 'No se pudo cancelar la suscripción');
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mi Suscripción</h1>

        {topError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
            {topError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] text-gray-600">
            Cargando...
          </div>
        ) : !susActiva ? (
          <div className="p-4 rounded-md bg-gray-50 border text-gray-600">
            No tienes una suscripción activa.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detalle de la suscripción */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Detalle</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <span className="font-medium">Plan:</span> {planNombre}
                </p>
                <p>
                  <span className="font-medium">Inicio:</span>{' '}
                  {new Date(susActiva.fecha_inicio).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Fin:</span>{' '}
                  {susActiva.fecha_fin ? new Date(susActiva.fecha_fin).toLocaleDateString() : '—'}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Estado:</span> {estadoBadge(susActiva.estado)}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Pago:</span>
                  {susActiva.estado_pago ? (
                    <span className="inline-flex items-center text-green-700">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Al día
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-700">
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-1" /> Pendiente
                    </span>
                  )}
                </p>
                {susActiva.fecha_cancelacion && (
                  <p>
                    <span className="font-medium">Fecha cancelación:</span>{' '}
                    {new Date(susActiva.fecha_cancelacion).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Panel de cancelación */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Cancelación</h2>
              <div className="text-sm text-gray-700">
                {susActiva.estado === 'activa' ? (
                  <>
                    <label className="block font-medium mb-1">Tipo de cancelación</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as TipoCancel)}
                      className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={cancelando}
                    >
                      <option value="inmediata">Inmediata (corte hoy)</option>
                      <option value="al_fin">Al final del período vigente</option>
                    </select>

                    <label className="block font-medium mb-1">Motivo (opcional)</label>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Escribe tu motivo aquí..."
                      disabled={cancelando}
                    ></textarea>

                    <button
                      onClick={cancelar}
                      disabled={cancelando}
                      className="mt-4 w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                    >
                      {cancelando ? 'Cancelando...' : 'Solicitar cancelación'}
                    </button>

                    <p className="mt-3 text-xs text-gray-500">
                      {tipo === 'inmediata'
                        ? 'La cancelación será efectiva inmediatamente.'
                        : 'La cancelación será efectiva al finalizar tu período actual.'}
                    </p>
                  </>
                ) : susActiva.estado === 'cancelada' ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    Esta suscripción ya ha sido cancelada.
                  </div>
                ) : susActiva.estado === 'expirada' ? (
                  <div className="p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    Esta suscripción ha expirado.
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                    Esta suscripción está pausada.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vitas;