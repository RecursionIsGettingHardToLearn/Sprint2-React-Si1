// src/routes/ClienteRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.tsx';
import Dashboard from '../pages/Cliente/Dashboard.tsx';
import ClientePerfil from '../pages/Cliente/ClientePerfil.tsx';
import PromocionList from '../pages/Cliente/Promocion/PromocionList.tsx';
import SuscripcionList from '../pages/Cliente/Suscripcion/SuscripcionList.tsx';
import MisSuscripciones from '../pages/Cliente/Suscripcion/MisSuscripciones.tsx';
import SuscripcionCancelado from '../pages/Cliente/Suscripcion/SuscripcionCancelado.tsx';
import SuscripcionExitoso from '../pages/Cliente/Suscripcion/SuscripcionExitoso.tsx';
import ClienteHorarioList from '../pages/Cliente/Horario/ClienteHorarioList.tsx';
import ClienteReservaList from '../pages/Cliente/Reserva/ClienteReservaList.tsx';
import ChangePassword from '../pages/CambiarContras.tsx';

const ClienteRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Cliente"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path='/suscripciones' element={<SuscripcionList />} />
            <Route path="/mis-suscripciones" element={<MisSuscripciones />} />

            <Route path='/promociones' element={<PromocionList />} />
            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/cliente-perfil' element={<ClientePerfil />} />

            <Route path="/horarios" element={<ClienteHorarioList />} />
            <Route path="/mis-reservas" element={<ClienteReservaList />} />

            <Route path="/suscripcion-pago-exitoso" element={<SuscripcionExitoso />} />
            <Route path="/suscripcion-pago-cancelado" element={<SuscripcionCancelado />} />
        </Routes>
    </ProtectedRoute>
);

export default ClienteRoutes;