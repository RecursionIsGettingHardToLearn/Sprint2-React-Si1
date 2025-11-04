import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
        
        <p className="text-gray-600 mb-6">
          Bienvenido.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out inline-block w-full"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default Welcome;