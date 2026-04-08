import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code2, Upload, Settings, LogOut } from 'lucide-react';
import { useNavbarLogic } from '../../hooks/layout/useNavbarLogic';

const Navbar: React.FC = () => {
  const { user, userIsTeacher, handleLogout } = useNavbarLogic();

  return (
    <nav className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 text-white">
      <div className="flex items-center gap-8">
        <NavLink 
          to="/home" 
          className="flex items-center gap-2 font-bold text-xl text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Code2 size={24} />
          <span>UnitTestCode</span>
        </NavLink>

        <div className="flex gap-4">
          <NavLink 
            to="/ide" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`
            }
          >
            <Code2 size={18} />
            <span>Web IDE</span>
          </NavLink>

          <NavLink 
            to="/submit" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`
            }
          >
            <Upload size={18} />
            <span>Evaluador</span>
          </NavLink>

          {userIsTeacher && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`
              }
            >
              <Settings size={18} />
              <span>Teacher Panel</span>
            </NavLink>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-gray-200">{user.email}</span>
            <span className="text-xs text-blue-400 font-mono">{user.role}</span>
          </div>
        )}
        
        <div className="h-9 w-9 bg-gray-800 rounded-full border border-gray-700 flex items-center justify-center text-sm font-bold text-blue-400">
          {user ? user.email.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="w-px h-6 bg-gray-800 mx-1"></div>

        <button 
          onClick={handleLogout}
          title="Cerrar sesión"
          className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-red-900/20 rounded"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;