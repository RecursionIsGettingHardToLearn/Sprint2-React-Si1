// src/config/menuItems.ts
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faHome, faUsers, faCogs, faBoxOpen, faUser,
  faSignOutAlt, faBuilding, faCalendarAlt, faClipboard
  , 
} from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  to?: string; // Make 'to' optional for parent items
  title: string;
  icon?: IconProp;
  action?: 'signout'; // Puedes extender esto si tienes más acciones
  subItems?: MenuItem[]; // New property for dropdown items
}

export const menuItemsByRole: Record<string, MenuItem[]> = {
  Administrador: [
    { to: '/administrador/dashboard', title: 'DASHBOARD', icon: faHome },

    {
      title: 'Módulo Usuarios',
      icon: faUsers,
      subItems: [
        { to: '/administrador/usuarios', title: 'Usuarios', icon: faUsers },
        { to: '/administrador/roles', title: 'Roles', icon: faCogs },
        { to: '/administrador/bitacoras', title: 'Bitacoras', icon: faBoxOpen },

       // { to: '/administrador/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    {
      title: 'Módulo Disciplinas',
      icon: faBuilding,
      subItems: [
      //  { to: '/administrador/cu9', title: 'Actualizar Rutinas', icon: faCog },
      //  { to: '/administrador/cu12', title: 'Gestionar Reservas', icon: faCalendarAlt },
     //   { to: '/administrador/cu13', title: 'Administrar Disciplinas', icon: faClipboard },
      ],
    },
    {
      title: 'Módulo Seguimiento',
      icon: faBuilding,
      subItems: [
       // { to: '/administrador/cu10', title: 'Regsitra Ant. Clini.', icon: faCog },
        { to: '/administrador/clientes', title: 'Gestionar Cliente', icon: faCalendarAlt },
       // { to: '/administrador/cu8', title: 'Gestionar Segumiento cliente', icon: faClipboard },
      ],
    },
    {
      title: 'Módulo Administracion',
      icon: faBuilding,
      subItems: [
       // { to: '/administrador/cu15', title: 'Generar Commprobante', icon: faCog },
       
        { to: '/administrador/perfil', title: 'Perfil', icon: faUser },
        { to: '/administrador/suscripciones', title: 'Gestionar Suscripciones', icon: faCalendarAlt },
        { to: '/administrador/promociones', title: 'Gestionar Promociones', icon: faClipboard },
       // { to: '/administrador/cu14', title: 'Gestionar Pago', icon: faClipboard },
      ],
    },
  ],
  Cliente: [
    { to: '/cliente/dashboard', title: 'DASHBOARD', icon: faHome },

    {
      title: 'Módulo Usuarios',
      icon: faUsers,
      subItems: [
        { to: '/cliente/cliente-perfil', title: 'Perfil', icon: faUser },
       // { to: '/cliente/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
  
    {
      title: 'Módulo Administracion',
      icon: faBuilding,
      subItems: [
        { to: '/cliente/suscripciones', title: ' Suscripciones', icon: faCalendarAlt },
        { to: '/cliente/promociones', title: ' Promociones', icon: faClipboard },
      ],
    },
  ],


};