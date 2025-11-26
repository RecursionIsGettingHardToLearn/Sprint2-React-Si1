// src/config/menuItems.ts
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faHome, faUsers, faCogs, faBoxOpen, faUser,
  faSignOutAlt, faBuilding, faCalendarAlt, faClipboard, faChalkboardTeacher, faUserMd
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
        { to: '/administrador/instructores', title: 'Instructores', icon: faChalkboardTeacher },
        { to: '/administrador/nutricionistas', title: 'Nutricionistas', icon: faUserMd },
        { to: '/administrador/roles', title: 'Roles', icon: faCogs },
        { to: '/administrador/bitacoras', title: 'Bitacoras', icon: faBoxOpen },
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    {
      title: 'Módulo Disciplinas',
      icon: faBuilding,
      subItems: [
       { to: '/administrador/disciplinas', title: 'Administrar Disciplinas', icon: faClipboard },
      ],
    },
    {
      title: 'Módulo Seguimiento',
      icon: faBuilding,
      subItems: [
        { to: '/administrador/clientes', title: 'Gestionar Cliente', icon: faCalendarAlt },
      ],
    },
    {
      title: 'Módulo Administracion',
      icon: faBuilding,
      subItems: [
        { to: '/administrador/perfil', title: 'Perfil', icon: faUser },
        { to: '/administrador/suscripciones', title: 'Gestionar Suscripciones', icon: faCalendarAlt },
        { to: '/administrador/promociones', title: 'Gestionar Promociones', icon: faClipboard },
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