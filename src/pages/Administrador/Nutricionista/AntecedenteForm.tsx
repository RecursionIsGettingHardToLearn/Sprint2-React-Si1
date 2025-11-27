import React, { useState, useEffect } from 'react';
import { fetchClients } from '../../../api/api-cliente';
import { fetchNutricionistas } from '../../../api/api-nutricionista';
import { createAntecedente } from '../../../api/api-antecedente';
import { type CustomClientResponse } from '../../../types/type-cliente';
import { type Nutricionista } from '../../../types/type-nutricionista';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface AntecedenteFormProps {
  nutricionistaId?: number; // Made optional
  onSuccess: () => void;
  onCancel: () => void;
}

const AntecedenteForm: React.FC<AntecedenteFormProps> = ({ nutricionistaId, onSuccess, onCancel }) => {
  const [clientes, setClientes] = useState<CustomClientResponse[]>([]);
  const [nutricionistas, setNutricionistas] = useState<Nutricionista[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [selectedNutricionistaId, setSelectedNutricionistaId] = useState<number | ''>(nutricionistaId || '');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [diagnostico, setDiagnostico] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [peso, setPeso] = useState<number | ''>('');
  const [altura, setAltura] = useState<number | ''>('');
  const [imc, setImc] = useState<number | ''>('');
  const [gc, setGc] = useState<number | ''>('');
  const [cc, setCc] = useState<number | ''>('');
  const [fechaProx, setFechaProx] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsData = await fetchClients();
        setClientes(clientsData);

        // If no nutritionist ID is provided, fetch list for dropdown
        if (!nutricionistaId) {
            const nutrisData = await fetchNutricionistas();
            setNutricionistas(nutrisData);
        }
      } catch (err) {
        console.error("Error loading data", err);
        setError("Error al cargar datos");
      }
    };
    loadData();
  }, [nutricionistaId]);

  // Auto-calculate IMC
  useEffect(() => {
    if (peso && altura && altura > 0) {
      const imcValue = Number(peso) / (Number(altura) * Number(altura));
      setImc(parseFloat(imcValue.toFixed(2)));
    }
  }, [peso, altura]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setError("Debe seleccionar un cliente");
      return;
    }
    if (!selectedNutricionistaId) {
        setError("Debe seleccionar un nutricionista");
        return;
    }

    setLoading(true);
    setError('');

    try {
      await createAntecedente({
        cliente: Number(clienteId),
        nutricionista: Number(selectedNutricionistaId),
        fecha,
        diagnostico,
        recomendaciones,
        peso: peso ? Number(peso) : undefined,
        altura: altura ? Number(altura) : undefined,
        imc: imc ? Number(imc) : undefined,
        gc: gc ? Number(gc) : undefined,
        cc: cc ? Number(cc) : undefined,
        fecha_prox_consulta: fechaProx || undefined,
      });
      onSuccess();
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl w-full mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Registrar Antecedente Clínico</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nutricionista Selection (only if not provided) */}
            {!nutricionistaId && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nutricionista</label>
                <select
                    value={selectedNutricionistaId}
                    onChange={(e) => setSelectedNutricionistaId(Number(e.target.value))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    required
                >
                    <option value="">Seleccione...</option>
                    {nutricionistas.map((n) => (
                    <option key={n.usuario} value={n.usuario}>
                        {n.nombre} {n.apellido_paterno}
                    </option>
                    ))}
                </select>
                </div>
            )}

            {/* Cliente Selection */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select
                value={clienteId}
                onChange={(e) => setClienteId(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                required
            >
                <option value="">Seleccione...</option>
                {clientes.map((c) => (
                <option key={c.usuario} value={c.usuario}>
                    {c.nombre} {c.apellido_paterno} ({c.usuario_username})
                </option>
                ))}
            </select>
            </div>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Consulta</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
            required
          />
        </div>

        {/* Medidas Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.01"
              value={peso}
              onChange={(e) => setPeso(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (m)</label>
            <input
              type="number"
              step="0.01"
              value={altura}
              onChange={(e) => setAltura(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IMC</label>
            <input
              type="number"
              step="0.01"
              value={imc}
              readOnly
              className="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500 shadow-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">% Grasa (GC)</label>
            <input
              type="number"
              step="0.01"
              value={gc}
              onChange={(e) => setGc(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cintura (CC cm)</label>
            <input
              type="number"
              step="0.01"
              value={cc}
              onChange={(e) => setCc(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Diagnostico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
          <textarea
            rows={3}
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>

        {/* Recomendaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
          <textarea
            rows={3}
            value={recomendaciones}
            onChange={(e) => setRecomendaciones(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>

        {/* Fecha Prox */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Consulta</label>
          <input
            type="date"
            value={fechaProx}
            onChange={(e) => setFechaProx(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? 'Guardando...' : 'Guardar Antecedente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AntecedenteForm;
