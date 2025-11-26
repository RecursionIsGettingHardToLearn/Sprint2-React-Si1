// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { menuItemsByRole, type MenuItem } from '../../config/menuConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import DropdownMenu from '../DropdownMenu';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.rol;

  // Explicitly type menuItems as an array of MenuItem
  const menuItems: MenuItem[] = role && menuItemsByRole[role as keyof typeof menuItemsByRole] || [];

  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const menuIcon = isOpen ? faTimes : faBars;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-gray-800 transition-colors duration-300 md:hidden focus:outline-none"
      >
        <FontAwesomeIcon icon={menuIcon} size="lg" />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 h-full flex flex-col transition-transform duration-300 ease-in-out bg-slate-900 shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-72`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h1 className="text-2xl font-extrabold text-white tracking-wider">App</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 transition-colors duration-300 rounded-full hover:bg-slate-800 md:hidden focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {menuItems.map((item: MenuItem) => (
              <li key={item.title} className="py-1">
                {item.subItems ? (
                  <DropdownMenu item={item} onItemClick={handleItemClick} />
                ) : (
                  <NavLink
                    to={item.to || '#'}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 text-base font-medium transition-colors duration-300 ease-in-out rounded-lg mx-2
                      ${isActive ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`
                    }
                    onClick={() => handleItemClick()}
                  >
                    <FontAwesomeIcon icon={item.icon || faQuestionCircle} className="mr-3 w-5 text-center" />
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;