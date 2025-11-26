import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClient, createClient, updateClient } from '../../../api/api-cliente';
import { fetchUsuarios } from '../../../api/api-usuario';
import { fetchSuscripciones } from '../../../api/api-suscripcion'; // Importar fetchSuscripciones
import { toUiError } from '../../../api/error';
import { type ClienteFormState, type CustomClientResponse } from '../../../types/type-cliente';
import { type Suscripcion } from '../../../types/type-suscripcion'; // Importar tipo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

const ClienteForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [form, setForm] = useState<ClienteFormState>({
        usuario: '',
        suscripcion_actual: '',
        fecha_ini_mem: '',
        fecha_fin_mem: '',
    });
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]); // Estado para suscripciones
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Add isSubmitting state
    const [topError, setTopError] = useState<string>('');
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const loadFormData = async () => {
            setLoading(true);
            try {
                // Cargar usuarios y suscripciones en paralelo
                const [usuariosData, suscripcionesData] = await Promise.all([
                    fetchUsuarios(),
                    fetchSuscripciones()
                ]);
                
                setUsuarios(usuariosData);
                setSuscripciones(suscripcionesData);

                if (isEditing && id) {
                    const clientData: CustomClientResponse = await fetchClient(+id);
                    // Encontrar el ID de la suscripción basado en el nombre si es necesario, 
                    // pero idealmente el backend debería devolver el ID. 
                    // Asumiremos que el backend devuelve el objeto o ID en una versión mejorada,
                    // pero por ahora si devuelve nombre, intentamos buscarlo.
                    // NOTA: El type CustomClientResponse solo tiene suscripcion_actual_nombre.
                    // Esto es un problema si queremos editar. Deberíamos actualizar el type y el backend para devolver el ID.
                    // Por ahora, intentaremos coincidir por nombre o dejarlo vacío si no coincide.
                    
                    const suscripcionEncontrada = suscripcionesData.find(s => s.nombre === clientData.suscripcion_actual_nombre);
                    
                    setForm({
                        usuario: clientData.usuario.toString(), // Convertir a string para el select
                        suscripcion_actual: suscripcionEncontrada ? suscripcionEncontrada.id.toString() : '',
                        fecha_ini_mem: clientData.fecha_ini_mem,
                        fecha_fin_mem: clientData.fecha_fin_mem,
                    });
                }
            } catch (err) {
                const uiError = toUiError(err);
                setTopError(uiError.message);
            } finally {
                setLoading(false);
            }
        };

        loadFormData();
    }, [id, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTopError('');
        setFormErrors({});

        const errors: Record<string, string[]> = {};

        if (!form.usuario) {
            errors.usuario = ['El campo "Usuario" es obligatorio'];
        }
        if (!form.fecha_ini_mem) {
            errors.fecha_ini_mem = ['La "Fecha Inicio Membresía" es obligatoria'];
        }
        if (!form.fecha_fin_mem) {
            errors.fecha_fin_mem = ['La "Fecha Fin Membresía" es obligatoria'];
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                ...form,
            };

            if (isEditing && id) {
                await updateClient(+id, payload);
            } else {
                await createClient(payload);
            }
            navigate('/administrador/clientes');
        } catch (err) {
            const uiError = toUiError(err);
            setTopError(uiError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEditing ? 'Editar Cliente' : 'Crear Cliente'}</h1>

                {topError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {topError}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500 text-lg">Cargando formulario...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                                <select
                                    name="usuario"
                                    value={form.usuario}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                                    disabled={isEditing} // Normalmente no se cambia el usuario al editar
                                >
                                    <option value="">Selecciona un usuario</option>
                                    {usuarios.map((usuario) => (
                                        <option key={usuario.id} value={usuario.id}>
                                            {usuario.username}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.usuario && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.usuario.join(', ')}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suscripción Actual</label>
                                <select
                                    name="suscripcion_actual"
                                    value={form.suscripcion_actual}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                                >
                                    <option value="">Selecciona una suscripción</option>
                                    {suscripciones.map((suscripcion) => (
                                        <option key={suscripcion.id} value={suscripcion.id}>
                                            {suscripcion.nombre} - ${suscripcion.precio}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.suscripcion_actual && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.suscripcion_actual.join(', ')}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio Membresía</label>
                                <input
                                    type="date"
                                    name="fecha_ini_mem"
                                    value={form.fecha_ini_mem}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                                />
                                {formErrors.fecha_ini_mem && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.fecha_ini_mem.join(', ')}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin Membresía</label>
                                <input
                                    type="date"
                                    name="fecha_fin_mem"
                                    value={form.fecha_fin_mem}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                                />
                                {formErrors.fecha_fin_mem && (
                                    <p className="mt-2 text-sm text-red-600">{formErrors.fecha_fin_mem.join(', ')}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/administrador/clientes')}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'}`}
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        Guardar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClienteForm;
