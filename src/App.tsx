import 'react-toastify/dist/ReactToastify.css'

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
//import NotFound from './pages/NotFound';
//import Forbidden from './pages/Forbidden';
import Perfil from './pages/Perfil';
import { useAuth } from './contexts/AuthContext';
import AdministradorRoutes from './routes/AdministradorRoutes';
import ClienteRoutes from './routes/ClienteRoutes';
import NutricionistaRoutes from './routes/NutricionistaRoutes';
import InstructorRoutes from './routes/InstructorRoutes';

import Sidebar from './components/Layout/Sidebar';
import Welcome from './pages/welcom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import UnauthorizedAccess from './pages/UnauthorizedAccess';
const LayoutWithSidebar = () => {
  const { user } = useAuth();
  if (!user) return null; // o un spinner
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
          <Route
            path="/administrador/*"
            element={
              <ProtectedRoute requiredRoles={['Administrador']}>
                <AdministradorRoutes />
              </ProtectedRoute>
            }
          />

        </Route>
        <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
          <Route
            path="/cliente/*"
            element={
              <ProtectedRoute requiredRoles={['Cliente']}>
                <ClienteRoutes />
              </ProtectedRoute>
            }
          />

        </Route>
        <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
          <Route
            path="/nutricionista/*"
            element={
              <ProtectedRoute requiredRoles={['Nutricionista']}>
                <NutricionistaRoutes />
              </ProtectedRoute>
            }
          />
        </Route>
         <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
          <Route
            path="/instructor/*"
            element={
              <ProtectedRoute requiredRoles={['Instructor']}>
                <InstructorRoutes />
              </ProtectedRoute>
            }
          />
        
        </Route>
       {/** <Route path="/forbidden" element={<Forbidden />} />{/**
       {/** <Route path="*" element={<NotFound />} />**/}
        <Route
          path='/perfil' element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
