// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RolesList from '../pages/Administrador/Rol/RolList';
import RolesForm from '../pages/Administrador/Rol/RolForm';
import Dashboard from '../pages/Administrador/Dashboard';
import BitacoraList from '../pages/Administrador/Bitacora/BitacoraList';
import BitacoraDetail from '../pages/Administrador/DetalleBitacora/DetalleBitacoraList';

import UserList from '../pages/Administrador/Usuarios/UserList';
import UserForms from '../pages/Administrador/Usuarios/UserForms';
import UserDetail from '../pages/Administrador/Usuarios/UserDetail';
import ChangePasswordByUser from '../pages/Administrador/Usuarios/UserDetail';

import SuscripcionList from '../pages/Administrador/Suscripcion/SuscripcionList';
import SuscripcionForm from '../pages/Administrador/Suscripcion/SuscripcionForm';

import PromocionList from '../pages/Administrador/Promocion/PromocionList';
import PromocionForm from '../pages/Administrador/Promocion/PromocionForm';

import ClienteList from '../pages/Administrador/Cliente/ClienteList.tsx';
import ClienteForm from '../pages/Administrador/Cliente/ClienteForm.tsx';

import ChangePassword from '../pages/CambiarContras';
import Perfil from '../pages/Perfil.tsx';
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Administrador"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="roles" element={<RolesList />} />
            <Route path="roles/new" element={<RolesForm />} />
            <Route path="roles/:id/edit" element={<RolesForm />} />
            {/* RUTA DEL usuarios */}

            {/* RUTA DEL DASHBOARD */}
            <Route path="bitacoras" element={<BitacoraList />} />
            <Route path="bitacoras/:id" element={<BitacoraDetail />} />

            <Route path="usuarios" element={<UserList />} />
            <Route path="usuarios/:id" element={<UserDetail />} />
            <Route path="usuarios/new" element={<UserForms />} />
            <Route path="usuarios/:id/editar" element={<UserForms />} />
            <Route path="usuarios/:id/cambiar-contrasena" element={<ChangePasswordByUser />} /> {/* <--- NEW ROUTE */}

            // Agregar rutas de suscripciones
            <Route path="suscripciones" element={<SuscripcionList />} />
            <Route path="suscripciones/new" element={<SuscripcionForm />} />
            <Route path="suscripciones/:id/edit" element={<SuscripcionForm />} />

            <Route path="clientes" element={<ClienteList />} />
            <Route path="clientes/nuevo" element={<ClienteForm />} />
            <Route path="clientes/:id/editar" element={<ClienteForm />} />


            <Route path="promociones" element={<PromocionList />} />
            <Route path="promociones/new" element={<PromocionForm />} />
            <Route path="promociones/:id/edit" element={<PromocionForm />} />

            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/perfil' element={<Perfil />} />

        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;