import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faHome, faUsers, faCogs, faBoxOpen, faUser,
  faSignOutAlt, faBuilding, faCalendarAlt, faClipboard, faChalkboardTeacher, faUserMd, faFileMedical
} from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  to?: string;
  title: string;
  icon?: IconProp;
  action?: 'signout';
  subItems?: MenuItem[];
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
        { to: '/administrador/horarios', title: 'Horarios', icon: faCalendarAlt },
        { to: '/administrador/reservas', title: 'Reservas', icon: faCalendarAlt },
      ],
    },
    {
      title: 'Módulo Seguimiento',
      icon: faBuilding,
      subItems: [
        { to: '/administrador/clientes', title: 'Gestionar Cliente', icon: faCalendarAlt },
        { to: '/administrador/antecedentes-clinicos', title: 'Antecedentes', icon: faFileMedical },
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
      title: 'Módulo Clases',
      icon: faCalendarAlt,
      subItems: [
        { to: '/cliente/horarios', title: 'Horarios Disponibles', icon: faCalendarAlt },
        { to: '/cliente/mis-reservas', title: 'Mis Reservas', icon: faCalendarAlt },
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