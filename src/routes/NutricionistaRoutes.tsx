// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.tsx';

import Dashboard from '../pages/Cliente/Dashboard.tsx';
import Perfil from '../pages/Perfil.tsx';

import ChangePassword from '../pages/CambiarContras.tsx';
// Nuevas importaciones para Grupos



const InquilinoRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Inquilino"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />

          

    
            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/perfil' element={<Perfil />} />
            




            {/* <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
        </Routes>
    </ProtectedRoute>
);

export default InquilinoRoutes;