import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClient, createClient, updateClient } from '../../../api/api-cliente';
import { fetchUsuarios } from '../../../api/api-usuario';  // Importar la función para obtener los usuarios=Cliente
import { toUiError } from '../../../api/error';
import { type ClienteFormState, type CustomClientResponse } from '../../../types/type-cliente';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
    const [usuarios, setUsuarios] = useState<any[]>([]);  // Almacenará la lista de usuarios
    const [loading, setLoading] = useState<boolean>(true);
    const [topError, setTopError] = useState<string>('');
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const loadFormData = async () => {
            setLoading(true);
            try {
                if (isEditing && id) {
                    // Cambiar de `fetchClients` a `fetchClient` para obtener un solo cliente
                    const clientData: CustomClientResponse = await fetchClient(+id);
                    setForm({
                        usuario: clientData.usuario_username,
                        suscripcion_actual: clientData.suscripcion_actual_nombre,
                        fecha_ini_mem: clientData.fecha_ini_mem,
                        fecha_fin_mem: clientData.fecha_fin_mem,
                    });
                }
                // Cargar los usuarios con rol "Administrador"
                const usuariosData = await fetchUsuarios();
                setUsuarios(usuariosData);
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

        // Validación simple del formulario
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

        // Si hay errores, actualizar el estado de los errores
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900">{isEditing ? 'Editar Cliente' : 'Crear Cliente'}</h1>

                {topError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {topError}
                    </div>
                )}

                {loading ? (
                    <div>Cargando formulario...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                            <select
                                name="usuario"
                                value={form.usuario}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona un usuario</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}> {/* Aquí se pasa el ID del usuario */}
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
                            <input
                                type="text"
                                name="suscripcion_actual"
                                value={form.suscripcion_actual}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
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
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {formErrors.fecha_fin_mem && (
                                <p className="mt-2 text-sm text-red-600">{formErrors.fecha_fin_mem.join(', ')}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/administrador/clientes')}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClienteForm;
