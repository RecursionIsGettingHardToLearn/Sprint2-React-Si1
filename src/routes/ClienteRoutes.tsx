// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.tsx';
import Dashboard from '../pages/Cliente/Dashboard.tsx';
import ClientePerfil from '../pages/Cliente/ClientePerfil.tsx';
// Nuevas importaciones para Grupos
import PromocionList from '../pages/Cliente/Promocion/PromocionList.tsx';
import SuscripcionList from '../pages/Cliente/Suscripcion/SuscripcionList.tsx';
import SuscripcionCancelado from '../pages/Cliente/Suscripcion/SuscripcionCancelado.tsx';
import SuscripcionExitoso from '../pages/Cliente/Suscripcion/SuscripcionExitoso.tsx';




import ChangePassword from '../pages/CambiarContras.tsx';

const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Cliente"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />

            <Route path='/suscripciones' element={< SuscripcionList  />} />
            <Route path='/promociones' element={<PromocionList />} />
            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/cliente-perfil' element={<ClientePerfil />} />

            <Route path="/suscripcion-pago-exitoso" element={<SuscripcionExitoso />} />
            <Route path="/suscripcion-pago-cancelado" element={<SuscripcionCancelado />} />

            {/* <Route path="*" element={<Navigate to="/not-found" replace />} />  */}
        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;